const fs = require('fs');

function splitIntoChunks() {
  console.log('📦 Splitting 116,215 ports into chunks of 500...');
  
  const sqlContent = fs.readFileSync('sql/import_ALL_unlocode_ports.sql', 'utf8');
  
  // Extract the VALUES section
  const valuesMatch = sqlContent.match(/VALUES\s+([\s\S]+);/);
  if (!valuesMatch) {
    console.error('❌ Could not find VALUES section');
    return;
  }
  
  const valuesContent = valuesMatch[1];
  
  // Split by lines to get individual port entries
  const lines = valuesContent.split('\n');
  const portEntries = lines.filter(line => line.trim() && line.includes('('));
  
  console.log(`📊 Found ${portEntries.length} port entries`);
  
  // Split into chunks of 500
  const chunkSize = 500;
  const totalChunks = Math.ceil(portEntries.length / chunkSize);
  
  console.log(`📦 Creating ${totalChunks} chunks...`);
  
  for (let i = 0; i < totalChunks; i++) {
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, portEntries.length);
    const chunk = portEntries.slice(start, end);
    
    // Create SQL for this chunk
    let chunkSQL = '-- Import UN/LOCODE ports chunk ' + String(i + 1).padStart(3, '0') + '\n';
    chunkSQL += 'INSERT INTO ports (\n';
    chunkSQL += '    world_port_index, region_name, main_port_name, alternate_port_name,\n';
    chunkSQL += '    un_locode, country_code, country_name, world_water_body, iho_sea_area,\n';
    chunkSQL += '    latitude, longitude, harbor_size, harbor_type, harbor_use, shelter_afforded,\n';
    chunkSQL += '    tidal_range, entrance_width, channel_depth, anchorage_depth, cargo_pier_depth,\n';
    chunkSQL += '    max_vessel_length, max_vessel_beam, max_vessel_draft,\n';
    chunkSQL += '    pilotage_compulsory, pilotage_available, tugs_assistance,\n';
    chunkSQL += '    facilities_wharves, facilities_anchorage, facilities_container,\n';
    chunkSQL += '    facilities_oil_terminal, facilities_lng_terminal, search_text,\n';
    chunkSQL += '    created_at, updated_at\n';
    chunkSQL += ') VALUES\n';
    
    // Join the chunk entries
    const chunkEntries = chunk.map(entry => {
      // Remove trailing comma if present
      return entry.replace(/,$/, '');
    });
    
    chunkSQL += chunkEntries.join(',\n') + ';\n';
    
    // Write chunk file
    const chunkFileName = `sql/unlocode_chunk_${String(i + 1).padStart(3, '0')}.sql`;
    fs.writeFileSync(chunkFileName, chunkSQL);
    
    if ((i + 1) % 50 === 0) {
      console.log(`📦 Created chunk ${i + 1}/${totalChunks}`);
    }
  }
  
  console.log(`✅ Created ${totalChunks} chunk files`);
  console.log(`📊 Each chunk contains up to ${chunkSize} ports`);
}

splitIntoChunks();
