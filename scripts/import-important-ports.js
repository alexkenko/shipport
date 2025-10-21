const fs = require('fs');

console.log('🚢 Importing 10,000 important ports from major maritime countries...');

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
  
  // Define important maritime countries and their codes
  const importantCountries = [
    { name: 'Germany', code: 'DE' },
    { name: 'United Kingdom', code: 'GB' },
    { name: 'Netherlands', code: 'NL' },
    { name: 'Denmark', code: 'DK' },
    { name: 'France', code: 'FR' },
    { name: 'Greece', code: 'GR' },
    { name: 'Italy', code: 'IT' },
    { name: 'Spain', code: 'ES' },
    { name: 'Portugal', code: 'PT' },
    { name: 'United States', code: 'US' },
    { name: 'Canada', code: 'CA' },
    { name: 'Brazil', code: 'BR' },
    { name: 'Argentina', code: 'AR' },
    { name: 'Chile', code: 'CL' },
    { name: 'Mexico', code: 'MX' },
    { name: 'China', code: 'CN' },
    { name: 'Japan', code: 'JP' },
    { name: 'Philippines', code: 'PH' },
    { name: 'South Korea', code: 'KR' },
    { name: 'Singapore', code: 'SG' },
    { name: 'Malaysia', code: 'MY' },
    { name: 'Thailand', code: 'TH' },
    { name: 'Vietnam', code: 'VN' },
    { name: 'Indonesia', code: 'ID' },
    { name: 'India', code: 'IN' },
    { name: 'Australia', code: 'AU' },
    { name: 'New Zealand', code: 'NZ' },
    { name: 'Norway', code: 'NO' },
    { name: 'Sweden', code: 'SE' },
    { name: 'Finland', code: 'FI' },
    { name: 'Poland', code: 'PL' },
    { name: 'Belgium', code: 'BE' },
    { name: 'Turkey', code: 'TR' },
    { name: 'Russia', code: 'RU' },
    { name: 'Ukraine', code: 'UA' },
    { name: 'Romania', code: 'RO' },
    { name: 'Bulgaria', code: 'BG' },
    { name: 'Croatia', code: 'HR' },
    { name: 'Slovenia', code: 'SI' },
    { name: 'Albania', code: 'AL' },
    { name: 'Montenegro', code: 'ME' },
    { name: 'Serbia', code: 'RS' },
    { name: 'Bosnia and Herzegovina', code: 'BA' },
    { name: 'Morocco', code: 'MA' },
    { name: 'Algeria', code: 'DZ' },
    { name: 'Tunisia', code: 'TN' },
    { name: 'Libya', code: 'LY' },
    { name: 'Egypt', code: 'EG' },
    { name: 'Israel', code: 'IL' },
    { name: 'Lebanon', code: 'LB' },
    { name: 'Syria', code: 'SY' },
    { name: 'Cyprus', code: 'CY' },
    { name: 'South Africa', code: 'ZA' },
    { name: 'Nigeria', code: 'NG' },
    { name: 'Ghana', code: 'GH' },
    { name: 'Kenya', code: 'KE' },
    { name: 'Tanzania', code: 'TZ' },
    { name: 'Mozambique', code: 'MZ' },
    { name: 'Angola', code: 'AO' },
    { name: 'Namibia', code: 'NA' },
    { name: 'Madagascar', code: 'MG' },
    { name: 'Mauritius', code: 'MU' },
    { name: 'Seychelles', code: 'SC' },
    { name: 'Bangladesh', code: 'BD' },
    { name: 'Sri Lanka', code: 'LK' },
    { name: 'Myanmar', code: 'MM' },
    { name: 'Cambodia', code: 'KH' },
    { name: 'Laos', code: 'LA' },
    { name: 'Brunei', code: 'BN' },
    { name: 'Taiwan', code: 'TW' },
    { name: 'Hong Kong', code: 'HK' },
    { name: 'Macau', code: 'MO' },
    { name: 'North Korea', code: 'KP' },
    { name: 'Mongolia', code: 'MN' },
    { name: 'Kazakhstan', code: 'KZ' },
    { name: 'Azerbaijan', code: 'AZ' },
    { name: 'Georgia', code: 'GE' },
    { name: 'Armenia', code: 'AM' },
    { name: 'Iran', code: 'IR' },
    { name: 'Iraq', code: 'IQ' },
    { name: 'Kuwait', code: 'KW' },
    { name: 'Saudi Arabia', code: 'SA' },
    { name: 'United Arab Emirates', code: 'AE' },
    { name: 'Qatar', code: 'QA' },
    { name: 'Bahrain', code: 'BH' },
    { name: 'Oman', code: 'OM' },
    { name: 'Yemen', code: 'YE' },
    { name: 'Jordan', code: 'JO' },
    { name: 'Iceland', code: 'IS' },
    { name: 'Greenland', code: 'GL' },
    { name: 'Faroe Islands', code: 'FO' },
    { name: 'Estonia', code: 'EE' },
    { name: 'Latvia', code: 'LV' },
    { name: 'Lithuania', code: 'LT' },
    { name: 'Ireland', code: 'IE' },
    { name: 'Iceland', code: 'IS' },
    { name: 'Greenland', code: 'GL' },
    { name: 'Faroe Islands', code: 'FO' }
  ];
  
  const selectedPorts = [];
  const countriesFound = {};
  
  // Sample ports from each important country
  for (const country of importantCountries) {
    let count = 0;
    const maxPerCountry = Math.ceil(10000 / importantCountries.length); // Distribute evenly
    
    for (let i = 0; i < allValues.length && count < maxPerCountry; i++) {
      const port = allValues[i];
      if (port && port.includes(`'${country.code}'`) && port.includes(`'${country.name}'`)) {
        selectedPorts.push(port);
        count++;
        countriesFound[country.name] = (countriesFound[country.name] || 0) + 1;
      }
    }
  }
  
  // If we don't have enough ports, fill with random ports from any country
  if (selectedPorts.length < 10000) {
    console.log(`📊 Found ${selectedPorts.length} ports from specific countries, filling with random ports...`);
    const remaining = 10000 - selectedPorts.length;
    
    for (let i = 0; i < allValues.length && selectedPorts.length < 10000; i++) {
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
  console.log('🌍 Countries found:', Object.entries(countriesFound)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
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
  fs.writeFileSync('sql/important_10000_ports.sql', insertSQL);
  console.log('✅ Important ports SQL written to sql/important_10000_ports.sql');
  
} catch (error) {
  console.error('❌ Error:', error);
}
