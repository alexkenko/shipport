const fs = require('fs');

// Create a script to combine multiple chunks into larger batches
function createLargerBatches() {
  console.log('📦 Creating larger batches from chunks...');
  
  const chunksDir = 'sql';
  const chunkFiles = fs.readdirSync(chunksDir)
    .filter(file => file.startsWith('unlocode_chunk_') && file.endsWith('.sql'))
    .sort();
  
  console.log(`📊 Found ${chunkFiles.length} chunk files`);
  
  // Combine chunks into batches of 10 (5,000 ports each)
  const batchSize = 10;
  const totalBatches = Math.ceil(chunkFiles.length / batchSize);
  
  console.log(`📦 Creating ${totalBatches} batches of ${batchSize} chunks each`);
  
  for (let batchNum = 0; batchNum < totalBatches; batchNum++) {
    const startChunk = batchNum * batchSize;
    const endChunk = Math.min(startChunk + batchSize, chunkFiles.length);
    const batchChunks = chunkFiles.slice(startChunk, endChunk);
    
    console.log(`📦 Creating batch ${batchNum + 1}: chunks ${startChunk + 1}-${endChunk}`);
    
    let batchSQL = `-- Import UN/LOCODE ports batch ${String(batchNum + 1).padStart(3, '0')} (chunks ${startChunk + 1}-${endChunk})\n`;
    batchSQL += 'INSERT INTO ports (\n';
    batchSQL += '    world_port_index, region_name, main_port_name, alternate_port_name,\n';
    batchSQL += '    un_locode, country_code, country_name, world_water_body, iho_sea_area,\n';
    batchSQL += '    latitude, longitude, harbor_size, harbor_type, harbor_use, shelter_afforded,\n';
    batchSQL += '    tidal_range, entrance_width, channel_depth, anchorage_depth, cargo_pier_depth,\n';
    batchSQL += '    max_vessel_length, max_vessel_beam, max_vessel_draft,\n';
    batchSQL += '    pilotage_compulsory, pilotage_available, tugs_assistance,\n';
    batchSQL += '    facilities_wharves, facilities_anchorage, facilities_container,\n';
    batchSQL += '    facilities_oil_terminal, facilities_lng_terminal, search_text,\n';
    batchSQL += '    created_at, updated_at\n';
    batchSQL += ') VALUES\n';
    
    let allValues = [];
    
    for (const chunkFile of batchChunks) {
      const chunkPath = `${chunksDir}/${chunkFile}`;
      const chunkContent = fs.readFileSync(chunkPath, 'utf8');
      
      // Extract VALUES section
      const valuesMatch = chunkContent.match(/VALUES\s+([\s\S]+);/);
      if (valuesMatch) {
        const valuesContent = valuesMatch[1];
        const lines = valuesContent.split('\n');
        const portEntries = lines.filter(line => line.trim() && line.includes('('));
        
        // Remove trailing commas
        const cleanEntries = portEntries.map(entry => entry.replace(/,$/, ''));
        allValues.push(...cleanEntries);
      }
    }
    
    batchSQL += allValues.join(',\n') + ';\n';
    
    // Write batch file
    const batchFileName = `sql/unlocode_batch_${String(batchNum + 1).padStart(3, '0')}.sql`;
    fs.writeFileSync(batchFileName, batchSQL);
    
    console.log(`✅ Created ${batchFileName} with ${allValues.length} ports`);
  }
  
  console.log(`🎉 Created ${totalBatches} batch files`);
}

createLargerBatches();
