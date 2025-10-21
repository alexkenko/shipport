const fs = require('fs');

console.log('🚢 Importing ports from major countries...');

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
  
  // Find ports from major countries by sampling different parts of the file
  const majorCountries = ['Netherlands', 'Japan', 'China', 'Germany', 'United States', 'United Kingdom', 'France', 'Italy', 'Spain', 'Canada', 'Australia', 'Brazil', 'India', 'Russia'];
  const selectedPorts = [];
  
  // Sample from different parts of the file to get variety
  const sampleRanges = [
    { start: 0, end: 1000 },           // Early ports
    { start: 10000, end: 11000 },      // Mid-early
    { start: 20000, end: 21000 },      // Mid
    { start: 30000, end: 31000 },      // Mid-late
    { start: 40000, end: 41000 },      // Late
    { start: 50000, end: 51000 },      // Very late
    { start: 60000, end: 61000 },      // Near end
    { start: 70000, end: 71000 },      // Near end
    { start: 80000, end: 81000 },      // Near end
    { start: 90000, end: 91000 },      // Near end
    { start: 100000, end: 101000 },    // Near end
    { start: 110000, end: 111000 },    // Near end
  ];
  
  for (const range of sampleRanges) {
    for (let i = range.start; i < Math.min(range.end, allValues.length); i++) {
      const port = allValues[i];
      if (port && majorCountries.some(country => port.includes(`'${country}'`))) {
        selectedPorts.push(port);
        if (selectedPorts.length >= 1000) break; // Limit to 1000 ports
      }
    }
    if (selectedPorts.length >= 1000) break;
  }
  
  console.log(`🎯 Selected ${selectedPorts.length} ports from major countries`);
  
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
  
  // Show sample of countries we found
  const countriesFound = new Set();
  selectedPorts.forEach(port => {
    majorCountries.forEach(country => {
      if (port.includes(`'${country}'`)) {
        countriesFound.add(country);
      }
    });
  });
  
  console.log('🌍 Countries found:', Array.from(countriesFound).join(', '));
  
} catch (error) {
  console.error('❌ Error:', error);
}
