const fs = require('fs');

console.log('🚢 Executing 3,000 important ports import...');

try {
  // Read the SQL file
  const sqlContent = fs.readFileSync('sql/important_3000_ports.sql', 'utf8');
  
  // Split into smaller chunks of 100 ports each
  const valuesMatch = sqlContent.match(/VALUES\s+([\s\S]+);/);
  if (!valuesMatch) {
    console.error('❌ Could not find VALUES in SQL file');
    process.exit(1);
  }
  
  const valuesString = valuesMatch[1];
  const allValues = valuesString.split(/\),\s*\(/);
  
  // Clean up the first and last entries
  allValues[0] = allValues[0].replace(/^\(/, '');
  allValues[allValues.length - 1] = allValues[allValues.length - 1].replace(/\);?\s*$/, '');
  
  console.log(`📊 Found ${allValues.length} ports to import`);
  
  // Create batches of 100 ports each
  const batchSize = 100;
  const batches = [];
  
  for (let i = 0; i < allValues.length; i += batchSize) {
    const batch = allValues.slice(i, i + batchSize);
    const batchSQL = `INSERT INTO ports (
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
    
    batches.push(batchSQL);
  }
  
  console.log(`📦 Created ${batches.length} batches of ${batchSize} ports each`);
  
  // Write first 10 batches to a file for execution
  const firstBatches = batches.slice(0, 10);
  const firstBatchesSQL = firstBatches.join('\n\n');
  fs.writeFileSync('sql/import_first_1000_important.sql', firstBatchesSQL);
  
  console.log('✅ First 1000 important ports ready in sql/import_first_1000_important.sql');
  console.log('📝 Execute this file to import the first 1000 ports');
  
} catch (error) {
  console.error('❌ Error:', error);
}
