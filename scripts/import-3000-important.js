const fs = require('fs');

console.log('🚢 Importing 3,000 important ports from major maritime countries...');

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
  
  // Define priority maritime countries
  const priorityCountries = [
    { name: 'Germany', code: 'DE', weight: 3 },
    { name: 'United Kingdom', code: 'GB', weight: 3 },
    { name: 'Netherlands', code: 'NL', weight: 3 },
    { name: 'Denmark', code: 'DK', weight: 2 },
    { name: 'France', code: 'FR', weight: 3 },
    { name: 'Greece', code: 'GR', weight: 2 },
    { name: 'Italy', code: 'IT', weight: 3 },
    { name: 'Spain', code: 'ES', weight: 3 },
    { name: 'Portugal', code: 'PT', weight: 2 },
    { name: 'United States', code: 'US', weight: 3 },
    { name: 'Canada', code: 'CA', weight: 2 },
    { name: 'Brazil', code: 'BR', weight: 2 },
    { name: 'China', code: 'CN', weight: 3 },
    { name: 'Japan', code: 'JP', weight: 3 },
    { name: 'Philippines', code: 'PH', weight: 2 },
    { name: 'South Korea', code: 'KR', weight: 2 },
    { name: 'Singapore', code: 'SG', weight: 2 },
    { name: 'Malaysia', code: 'MY', weight: 2 },
    { name: 'Thailand', code: 'TH', weight: 2 },
    { name: 'India', code: 'IN', weight: 2 },
    { name: 'Australia', code: 'AU', weight: 2 },
    { name: 'Norway', code: 'NO', weight: 2 },
    { name: 'Sweden', code: 'SE', weight: 2 },
    { name: 'Poland', code: 'PL', weight: 2 },
    { name: 'Belgium', code: 'BE', weight: 2 },
    { name: 'Turkey', code: 'TR', weight: 2 },
    { name: 'Russia', code: 'RU', weight: 2 },
    { name: 'Georgia', code: 'GE', weight: 1 },
    { name: 'Ukraine', code: 'UA', weight: 1 },
    { name: 'Romania', code: 'RO', weight: 1 },
    { name: 'Bulgaria', code: 'BG', weight: 1 },
    { name: 'Croatia', code: 'HR', weight: 1 },
    { name: 'Morocco', code: 'MA', weight: 1 },
    { name: 'Egypt', code: 'EG', weight: 1 },
    { name: 'South Africa', code: 'ZA', weight: 1 },
    { name: 'Nigeria', code: 'NG', weight: 1 },
    { name: 'Bangladesh', code: 'BD', weight: 1 },
    { name: 'Sri Lanka', code: 'LK', weight: 1 },
    { name: 'Taiwan', code: 'TW', weight: 1 },
    { name: 'Hong Kong', code: 'HK', weight: 1 },
    { name: 'Saudi Arabia', code: 'SA', weight: 1 },
    { name: 'United Arab Emirates', code: 'AE', weight: 1 },
    { name: 'Iceland', code: 'IS', weight: 1 },
    { name: 'Estonia', code: 'EE', weight: 1 },
    { name: 'Latvia', code: 'LV', weight: 1 },
    { name: 'Lithuania', code: 'LT', weight: 1 },
    { name: 'Ireland', code: 'IE', weight: 1 }
  ];
  
  const selectedPorts = [];
  const countriesFound = {};
  const targetPorts = 3000;
  
  // Calculate total weight for distribution
  const totalWeight = priorityCountries.reduce((sum, country) => sum + country.weight, 0);
  
  // Sample ports from each priority country based on weight
  for (const country of priorityCountries) {
    const targetForCountry = Math.floor((country.weight / totalWeight) * targetPorts);
    let count = 0;
    
    for (let i = 0; i < allValues.length && count < targetForCountry; i++) {
      const port = allValues[i];
      if (port && port.includes(`'${country.code}'`) && port.includes(`'${country.name}'`)) {
        selectedPorts.push(port);
        count++;
        countriesFound[country.name] = (countriesFound[country.name] || 0) + 1;
      }
    }
  }
  
  // Fill remaining slots with random ports from any country
  if (selectedPorts.length < targetPorts) {
    console.log(`📊 Found ${selectedPorts.length} ports from priority countries, filling with random ports...`);
    const remaining = targetPorts - selectedPorts.length;
    
    for (let i = 0; i < allValues.length && selectedPorts.length < targetPorts; i++) {
      const port = allValues[i];
      if (port && !selectedPorts.includes(port)) {
        selectedPorts.push(port);
        // Extract country name for counting
        const countryMatch = port.match(/'([^']+)',\s*'([^']+)',\s*'([^']+)'/);
        if (countryMatch) {
          const countryName = countryMatch[3];
          countriesFound[countryName] = (countriesFound[countryName] || 0) + 1;
        }
      }
    }
  }
  
  console.log(`🎯 Selected ${selectedPorts.length} important ports`);
  console.log('🌍 Top countries found:', Object.entries(countriesFound)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([country, count]) => `${country}: ${count}`)
    .join(', '));
  
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
  fs.writeFileSync('sql/important_3000_ports.sql', insertSQL);
  console.log('✅ Important ports SQL written to sql/important_3000_ports.sql');
  
} catch (error) {
  console.error('❌ Error:', error);
}
