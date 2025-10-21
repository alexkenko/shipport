const fs = require('fs');

console.log('🚢 Importing first 10,000 ports from ALL countries...');

try {
  // Read the SQL file
  const sqlContent = fs.readFileSync('sql/batched_geonames_ports.sql', 'utf8');
  
  // Extract VALUES section
  const valuesMatch = sqlContent.match(/VALUES\s+([\s\S]+)/);
  if (!valuesMatch) {
    console.error('❌ Could not find VALUES in SQL file');
    process.exit(1);
  }
  
  const valuesString = valuesMatch[1];
  const allValues = valuesString.split(/\),\s*\(/);
  
  // Clean up the first and last entries
  allValues[0] = allValues[0].replace(/^\(/, '');
  allValues[allValues.length - 1] = allValues[allValues.length - 1].replace(/\);?\s*$/, '');
  
  console.log(`📊 Found ${allValues.length} total ports`);
  
  // Take first 10,000 ports
  const portsToImport = allValues.slice(0, 10000);
  console.log(`🎯 Importing first 10,000 ports...`);
  
  // Import in batches of 100
  const batchSize = 100;
  let totalImported = 0;
  
  for (let i = 0; i < portsToImport.length; i += batchSize) {
    const batch = portsToImport.slice(i, i + batchSize);
    const batchNumber = Math.floor(i / batchSize) + 1;
    const totalBatches = Math.ceil(portsToImport.length / batchSize);
    
    console.log(`📦 Processing batch ${batchNumber}/${totalBatches} (${batch.length} ports)...`);
    
    // Create INSERT statement for this batch
    const insertSQL = `INSERT INTO ports (
      world_port_index, region_name, main_port_name, alternate_port_name,
      un_locode, country_code, country_name, world_water_body, iho_sea_area,
      latitude, longitude, harbor_size, harbor_type, harbor_use, shelter_afforded,
      tidal_range, entrance_width, channel_depth, anchorage_depth, cargo_pier_depth,
      max_vessel_length, max_vessel_beam, max_vessel_draft,
      pilotage_compulsory, pilotage_available, tugs_assistance,
      facilities_wharves, facilities_anchorage, facilities_container,
      facilities_oil_terminal, facilities_lng_terminal, search_text,
      created_at, updated_at
    ) VALUES ${batch.map(row => `(${row})`).join(', ')};`;
    
    // Write batch to file
    const filename = `sql/import_batch_${batchNumber.toString().padStart(3, '0')}.sql`;
    fs.writeFileSync(filename, insertSQL);
    
    console.log(`✅ Batch ${batchNumber} written to ${filename}`);
    totalImported += batch.length;
  }
  
  console.log(`\n✅ Generated ${totalBatches} batch files with ${totalImported} total ports`);
  console.log('📝 Now executing the batches...');
  
  // Execute the first few batches to test
  for (let i = 1; i <= Math.min(10, totalBatches); i++) {
    const filename = `sql/import_batch_${i.toString().padStart(3, '0')}.sql`;
    const batchSQL = fs.readFileSync(filename, 'utf8');
    
    console.log(`🔄 Executing batch ${i}...`);
    // Write to a single file for manual execution
    if (i === 1) {
      fs.writeFileSync('sql/import_first_1000_ports.sql', batchSQL);
    } else {
      fs.appendFileSync('sql/import_first_1000_ports.sql', '\n\n' + batchSQL);
    }
  }
  
  console.log('✅ First 1000 ports ready for import in sql/import_first_1000_ports.sql');
  
} catch (error) {
  console.error('❌ Error:', error);
}
