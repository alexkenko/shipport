const fs = require('fs');

// Script to split the important ports into manageable batches
async function splitImportantPorts() {
  console.log('📦 Splitting important ports into batches...');
  
  const sqlFile = 'sql/important_maritime_ports.sql';
  const sqlContent = fs.readFileSync(sqlFile, 'utf8');
  
  // Extract the VALUES section
  const valuesMatch = sqlContent.match(/VALUES\s+([\s\S]+);/);
  if (!valuesMatch) {
    console.error('❌ Could not find VALUES section');
    return;
  }
  
  const valuesContent = valuesMatch[1];
  const lines = valuesContent.split('\n');
  const portEntries = lines.filter(line => line.trim() && line.includes('('));
  
  console.log(`📊 Found ${portEntries.length} port entries`);
  
  // Split into batches of 1000 ports each
  const batchSize = 1000;
  const totalBatches = Math.ceil(portEntries.length / batchSize);
  
  console.log(`📦 Creating ${totalBatches} batches of ${batchSize} ports each`);
  
  for (let i = 0; i < totalBatches; i++) {
    const start = i * batchSize;
    const end = Math.min(start + batchSize, portEntries.length);
    const batch = portEntries.slice(start, end);
    
    // Create batch SQL
    let batchSQL = '-- Important Maritime Ports Batch ' + String(i + 1).padStart(3, '0') + '\n';
    batchSQL += '-- Ports ' + (start + 1) + '-' + end + ' of ' + portEntries.length + '\n\n';
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
    batchSQL += batch.join(',\n') + ';\n';
    
    // Write batch file
    const batchFileName = `sql/important_batch_${String(i + 1).padStart(3, '0')}.sql`;
    fs.writeFileSync(batchFileName, batchSQL);
    
    console.log(`✅ Created ${batchFileName} with ${batch.length} ports`);
  }
  
  console.log(`🎉 Split complete! Created ${totalBatches} batch files`);
}

splitImportantPorts();
