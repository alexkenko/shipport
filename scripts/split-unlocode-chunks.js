const fs = require('fs');

function splitPortsIntoChunks() {
  try {
    console.log('🚢 Reading UN/LOCODE ports SQL file...');
    const sql = fs.readFileSync('sql/import_all_unlocode_ports.sql', 'utf8');
    
    // Extract the INSERT part
    const insertMatch = sql.match(/INSERT INTO ports \([\s\S]+?\) VALUES\n([\s\S]+);/);
    if (!insertMatch) {
      console.error('❌ Could not find INSERT statement in SQL file');
      return;
    }
    
    const valuesPart = insertMatch[1].trim();
    const rows = valuesPart.split('),\n').map(row => row.trim().replace(/^\(|\)$/, ''));
    
    console.log(`📊 Found ${rows.length} port rows`);
    
    // Create chunks of 500 ports each
    const chunkSize = 500;
    const totalChunks = Math.ceil(rows.length / chunkSize);
    
    console.log(`📦 Creating ${totalChunks} chunks of ${chunkSize} ports each...`);
    
    for (let i = 0; i < totalChunks; i++) {
      const start = i * chunkSize;
      const end = Math.min(start + chunkSize, rows.length);
      const chunkRows = rows.slice(start, end);
      
      // Reconstruct the chunk SQL
      const chunkSQL = `-- Chunk ${i + 1}/${totalChunks} - Ports ${start + 1} to ${end}
DELETE FROM ports;

INSERT INTO ports (
    world_port_index, region_name, main_port_name, alternate_port_name,
    un_locode, country_code, country_name, world_water_body, iho_sea_area,
    latitude, longitude, harbor_size, harbor_type, harbor_use, shelter_afforded,
    tidal_range, entrance_width, channel_depth, anchorage_depth, cargo_pier_depth,
    max_vessel_length, max_vessel_beam, max_vessel_draft,
    pilotage_compulsory, pilotage_available, tugs_assistance,
    facilities_wharves, facilities_anchorage, facilities_container,
    facilities_oil_terminal, facilities_lng_terminal, search_text,
    created_at, updated_at
) VALUES
(${chunkRows.join('),\n(')});
`;
      
      const chunkNum = String(i + 1).padStart(3, '0');
      const filename = `sql/unlocode_chunk_${chunkNum}.sql`;
      
      fs.writeFileSync(filename, chunkSQL);
      console.log(`✅ Created ${filename} (${chunkRows.length} ports)`);
    }
    
    console.log(`🎉 Created ${totalChunks} chunk files`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

splitPortsIntoChunks();
