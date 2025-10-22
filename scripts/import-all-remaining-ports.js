const fs = require('fs');
const path = require('path');

// Script to import all remaining ports from batch files
async function importAllRemainingPorts() {
  console.log('🚢 Starting import of ALL remaining ports from batch files...');
  
  const batchesDir = 'sql';
  const batchFiles = fs.readdirSync(batchesDir)
    .filter(file => file.startsWith('unlocode_batch_') && file.endsWith('.sql'))
    .sort();
  
  console.log(`📦 Found ${batchFiles.length} batch files to import`);
  
  let totalImported = 0;
  let successCount = 0;
  let errorCount = 0;
  
  for (let i = 0; i < batchFiles.length; i++) {
    const batchFile = batchFiles[i];
    const batchPath = path.join(batchesDir, batchFile);
    
    try {
      console.log(`📦 Processing ${batchFile} (${i + 1}/${batchFiles.length})...`);
      
      const sqlContent = fs.readFileSync(batchPath, 'utf8');
      
      // Extract the VALUES section
      const valuesMatch = sqlContent.match(/VALUES\s+([\s\S]+);/);
      if (!valuesMatch) {
        console.log(`❌ No VALUES found in ${batchFile}`);
        continue;
      }
      
      const valuesContent = valuesMatch[1];
      
      // Split by lines to get individual port entries
      const lines = valuesContent.split('\n');
      const portEntries = lines.filter(line => line.trim() && line.includes('('));
      
      console.log(`📊 Found ${portEntries.length} ports in ${batchFile}`);
      
      // Clean up the entries (remove trailing commas)
      const cleanEntries = portEntries.map(entry => entry.replace(/,$/, ''));
      
      // Create SQL for this batch
      let batchSQL = 'INSERT INTO ports (\n';
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
      batchSQL += cleanEntries.join(',\n') + ';\n';
      
      // Write the cleaned SQL to a new file
      const outputFile = `sql/clean_${batchFile}`;
      fs.writeFileSync(outputFile, batchSQL);
      
      console.log(`✅ Created clean SQL file: ${outputFile}`);
      console.log(`📊 Ready to import ${cleanEntries.length} ports from ${batchFile}`);
      
      totalImported += cleanEntries.length;
      successCount++;
      
    } catch (error) {
      console.error(`❌ Error processing ${batchFile}:`, error.message);
      errorCount++;
    }
    
    // Progress update every 5 batches
    if ((i + 1) % 5 === 0) {
      console.log(`📊 Progress: ${i + 1}/${batchFiles.length} batches processed`);
    }
  }
  
  console.log(`🎉 Processing complete!`);
  console.log(`✅ Successfully processed: ${successCount} batches`);
  console.log(`❌ Errors: ${errorCount} batches`);
  console.log(`📊 Total ports ready for import: ${totalImported}`);
  console.log(`📁 Clean SQL files created in sql/ directory`);
}

importAllRemainingPorts();
