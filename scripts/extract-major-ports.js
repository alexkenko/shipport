const fs = require('fs');

console.log('🚢 Extracting ports from major countries...');

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
  
  // Find specific ports from major countries
  const majorCountries = [
    { name: 'Netherlands', code: 'NL' },
    { name: 'Japan', code: 'JP' },
    { name: 'China', code: 'CN' },
    { name: 'Germany', code: 'DE' },
    { name: 'United States', code: 'US' },
    { name: 'United Kingdom', code: 'GB' },
    { name: 'France', code: 'FR' },
    { name: 'Italy', code: 'IT' },
    { name: 'Spain', code: 'ES' },
    { name: 'Canada', code: 'CA' },
    { name: 'Australia', code: 'AU' },
    { name: 'Brazil', code: 'BR' },
    { name: 'India', code: 'IN' },
    { name: 'Russia', code: 'RU' }
  ];
  
  const selectedPorts = [];
  const countriesFound = {};
  
  // Sample ports from each major country
  for (const country of majorCountries) {
    let count = 0;
    for (let i = 0; i < allValues.length && count < 50; i++) {
      const port = allValues[i];
      if (port && port.includes(`'${country.code}'`) && port.includes(`'${country.name}'`)) {
        selectedPorts.push(port);
        count++;
        countriesFound[country.name] = (countriesFound[country.name] || 0) + 1;
      }
    }
  }
  
  console.log(`🎯 Selected ${selectedPorts.length} ports from major countries`);
  console.log('🌍 Countries found:', Object.entries(countriesFound).map(([country, count]) => `${country}: ${count}`).join(', '));
  
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
  ) VALUES ${selectedPorts.map(row => `(${row})`).join(', ')};`;
  
  // Write to file for execution
  fs.writeFileSync('sql/major_countries_ports.sql', insertSQL);
  console.log('✅ Major countries SQL written to sql/major_countries_ports.sql');
  
} catch (error) {
  console.error('❌ Error:', error);
}
