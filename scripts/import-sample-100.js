const fs = require('fs');

console.log('🚢 Importing first 100 ports as a test...');

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
  
  // Take first 100 ports
  const samplePorts = allValues.slice(0, 100);
  
  // Create INSERT statement
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
  ) VALUES ${samplePorts.map(row => `(${row})`).join(', ')};`;
  
  // Write to file for manual execution
  fs.writeFileSync('sql/sample_100_ports.sql', insertSQL);
  console.log('✅ Sample SQL written to sql/sample_100_ports.sql');
  console.log('📝 You can now execute this SQL manually');
  
} catch (error) {
  console.error('❌ Error:', error);
}
