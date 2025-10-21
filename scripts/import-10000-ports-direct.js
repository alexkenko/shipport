const fs = require('fs');

console.log('⚠️  IMPORTANT: This script will import exactly 10,000 ports.');
console.log('⚠️  User accounts will NOT be touched.\n');

async function importPorts() {
  try {
    console.log('🚢 Starting import of exactly 10,000 ports from batched_geonames_ports.sql...');
    
    // Read the SQL file
    console.log('📖 Reading batched_geonames_ports.sql...');
    const sqlContent = fs.readFileSync('sql/batched_geonames_ports.sql', 'utf8');
    
    // Extract VALUES from the INSERT statement
    const valuesMatch = sqlContent.match(/VALUES\s+([\s\S]+)/);
    if (!valuesMatch) {
      console.error('❌ Could not find VALUES in SQL file');
      return;
    }
    
    const valuesString = valuesMatch[1];
    // Split by ),( pattern but handle the first and last entries
    const allValues = valuesString.split(/\),\s*\(/);
    
    // Clean up the first and last entries
    allValues[0] = allValues[0].replace(/^\(/, '');
    allValues[allValues.length - 1] = allValues[allValues.length - 1].replace(/\);?\s*$/, '');
    
    console.log(`📊 Found ${allValues.length} port records in file`);
    console.log(`🎯 Importing first 10,000 ports...`);
    
    // Take only the first 10,000 ports
    const portsToImport = allValues.slice(0, 10000);
    
    // Clear existing ports first
    console.log('🗑️ Clearing existing ports...');
    const { execute_sql } = require('@superflows/mcp-supabase-client');
    await execute_sql({ query: 'DELETE FROM ports;' });
    console.log('✅ Existing ports cleared');
    
    // Import in batches of 100
    const batchSize = 100;
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
      
      try {
        await execute_sql({ query: insertSQL });
        console.log(`✅ Batch ${batchNumber} imported successfully`);
      } catch (error) {
        console.error(`❌ Error importing batch ${batchNumber}:`, error.message);
        // Try individual inserts for this batch
        console.log(`🔄 Trying individual inserts for batch ${batchNumber}...`);
        
        for (let j = 0; j < batch.length; j++) {
          try {
            const individualSQL = `INSERT INTO ports (
              world_port_index, region_name, main_port_name, alternate_port_name,
              un_locode, country_code, country_name, world_water_body, iho_sea_area,
              latitude, longitude, harbor_size, harbor_type, harbor_use, shelter_afforded,
              tidal_range, entrance_width, channel_depth, anchorage_depth, cargo_pier_depth,
              max_vessel_length, max_vessel_beam, max_vessel_draft,
              pilotage_compulsory, pilotage_available, tugs_assistance,
              facilities_wharves, facilities_anchorage, facilities_container,
              facilities_oil_terminal, facilities_lng_terminal, search_text,
              created_at, updated_at
            ) VALUES (${batch[j]});`;
            
            await execute_sql({ query: individualSQL });
          } catch (individualError) {
            console.warn(`⚠️ Skipping malformed port ${j + 1} in batch ${batchNumber}: ${individualError.message}`);
          }
        }
      }
    }
    
    // Verify import
    const { data: countResult } = await execute_sql({ query: 'SELECT COUNT(*) as total FROM ports;' });
    const totalImported = countResult[0]?.total || 0;
    
    console.log(`\n✅ Import completed! Total ports in database: ${totalImported}`);
    
    // Check for major countries
    console.log('\n🌍 Checking major countries...');
    const countries = ['Netherlands', 'Japan', 'China', 'Germany', 'United States', 'United Kingdom', 'France', 'Italy', 'Spain', 'Canada'];
    
    for (const country of countries) {
      const { data: countryResult } = await execute_sql({ 
        query: `SELECT COUNT(*) as count FROM ports WHERE country_name ILIKE '%${country}%';` 
      });
      const count = countryResult[0]?.count || 0;
      console.log(`  ${country}: ${count} ports`);
    }
    
  } catch (error) {
    console.error('❌ Error during port import:', error);
  }
}

importPorts();
