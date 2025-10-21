const fs = require('fs');

async function importGlobalPorts() {
  try {
    console.log('🚢 Starting global ports import from JSON...');
    
    // Read the JSON file
    console.log('📄 Reading global_ports.json...');
    const jsonData = fs.readFileSync('Listofports/global_ports.json', 'utf8');
    const ports = JSON.parse(jsonData);
    
    console.log(`📊 Found ${ports.length} ports in JSON file`);
    
    // Transform the data to match our database schema
    const transformedPorts = ports.map((port, index) => {
      const countryCode = port.un_locode ? port.un_locode.substring(0, 2) : null;
      const searchText = [port.name, port.country, port.un_locode, port.type, port.continent]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .trim();
      
      // Determine harbor size
      const name = port.name.toLowerCase();
      let harborSize = 'Small';
      if (name.includes('rotterdam') || name.includes('singapore') || 
          name.includes('shanghai') || name.includes('los angeles') ||
          name.includes('hamburg') || name.includes('antwerp') ||
          name.includes('long beach') || name.includes('busan') ||
          name.includes('shenzhen') || name.includes('ningbo')) {
        harborSize = 'Large';
      } else if (name.includes('port of') || name.includes('harbor') || 
                 name.includes('terminal') || name.includes('marina')) {
        harborSize = 'Medium';
      }
      
      // Determine harbor type
      let harborType = 'Coastal (Artificial)';
      if (name.includes('river') || name.includes('inland')) {
        harborType = 'River (Natural)';
      } else if (name.includes('marina') || name.includes('yacht')) {
        harborType = 'Coastal (Natural)';
      }
      
      return {
        world_port_index: (index + 1).toString(),
        region_name: port.continent || null,
        main_port_name: port.name || 'Unknown Port',
        alternate_port_name: null,
        un_locode: port.un_locode || null,
        country_code: countryCode,
        country_name: port.country || null,
        world_water_body: null,
        iho_sea_area: null,
        latitude: port.latitude || null,
        longitude: port.longitude || null,
        harbor_size: harborSize,
        harbor_type: harborType,
        harbor_use: port.type === 'Seaport' ? 'Commercial' : 'Mixed',
        shelter_afforded: 'Good',
        tidal_range: null,
        entrance_width: null,
        channel_depth: null,
        anchorage_depth: null,
        cargo_pier_depth: null,
        max_vessel_length: null,
        max_vessel_beam: null,
        max_vessel_draft: null,
        pilotage_compulsory: true,
        pilotage_available: true,
        tugs_assistance: true,
        facilities_wharves: true,
        facilities_anchorage: true,
        facilities_container: port.type === 'Seaport',
        facilities_oil_terminal: false,
        facilities_lng_terminal: false,
        search_text: searchText
      };
    });
    
    console.log(`🔄 Transformed ${transformedPorts.length} ports for database import`);
    
    // Save to a SQL file for manual import
    const sqlFile = 'sql/import_global_ports.sql';
    let sqlContent = '-- Global Ports Import\n';
    sqlContent += '-- Generated from global_ports.json\n\n';
    sqlContent += 'DELETE FROM ports;\n\n';
    
    // Insert ports in batches
    const batchSize = 1000;
    for (let i = 0; i < transformedPorts.length; i += batchSize) {
      const batch = transformedPorts.slice(i, i + batchSize);
      
      sqlContent += `INSERT INTO ports (\n`;
      sqlContent += `  world_port_index, region_name, main_port_name, alternate_port_name,\n`;
      sqlContent += `  un_locode, country_code, country_name, world_water_body, iho_sea_area,\n`;
      sqlContent += `  latitude, longitude, harbor_size, harbor_type, harbor_use, shelter_afforded,\n`;
      sqlContent += `  tidal_range, entrance_width, channel_depth, anchorage_depth, cargo_pier_depth,\n`;
      sqlContent += `  max_vessel_length, max_vessel_beam, max_vessel_draft,\n`;
      sqlContent += `  pilotage_compulsory, pilotage_available, tugs_assistance,\n`;
      sqlContent += `  facilities_wharves, facilities_anchorage, facilities_container,\n`;
      sqlContent += `  facilities_oil_terminal, facilities_lng_terminal, search_text,\n`;
      sqlContent += `  created_at, updated_at\n`;
      sqlContent += `) VALUES\n`;
      
      const values = batch.map(port => {
        const escape = (str) => str ? `'${str.replace(/'/g, "''")}'` : 'NULL';
        const bool = (val) => val ? 'true' : 'false';
        const num = (val) => val !== null ? val : 'NULL';
        
        return `  (${escape(port.world_port_index)}, ${escape(port.region_name)}, ${escape(port.main_port_name)}, ${escape(port.alternate_port_name)},
    ${escape(port.un_locode)}, ${escape(port.country_code)}, ${escape(port.country_name)}, ${escape(port.world_water_body)}, ${escape(port.iho_sea_area)},
    ${num(port.latitude)}, ${num(port.longitude)}, ${escape(port.harbor_size)}, ${escape(port.harbor_type)}, ${escape(port.harbor_use)}, ${escape(port.shelter_afforded)},
    ${num(port.tidal_range)}, ${num(port.entrance_width)}, ${num(port.channel_depth)}, ${num(port.anchorage_depth)}, ${num(port.cargo_pier_depth)},
    ${num(port.max_vessel_length)}, ${num(port.max_vessel_beam)}, ${num(port.max_vessel_draft)},
    ${bool(port.pilotage_compulsory)}, ${bool(port.pilotage_available)}, ${bool(port.tugs_assistance)},
    ${bool(port.facilities_wharves)}, ${bool(port.facilities_anchorage)}, ${bool(port.facilities_container)},
    ${bool(port.facilities_oil_terminal)}, ${bool(port.facilities_lng_terminal)}, ${escape(port.search_text)},
    NOW(), NOW())`;
      }).join(',\n');
      
      sqlContent += values + ';\n\n';
    }
    
    // Write SQL file
    fs.writeFileSync(sqlFile, sqlContent);
    console.log(`📄 SQL file created: ${sqlFile}`);
    console.log(`📊 Total ports prepared for import: ${transformedPorts.length}`);
    console.log('✅ Please run the SQL file in your Supabase dashboard to complete the import');
    
  } catch (error) {
    console.error('❌ Import preparation failed:', error);
    throw error;
  }
}

// Run the import preparation
importGlobalPorts()
  .then(() => {
    console.log('✅ Global ports import preparation completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Global ports import preparation failed:', error);
    process.exit(1);
  });
