const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zurnrxtkmqtbcofwtild.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1cm5yeHRrbXF0YmNvZnd0aWxkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTM4NTIxMSwiZXhwIjoyMDc0OTYxMjExfQ.YourServiceRoleKey'
);

// Country code mapping for UN/LOCODE
const getCountryCode = (unLocode) => {
  if (!unLocode || unLocode.length < 2) return null;
  return unLocode.substring(0, 2);
};

// Generate search text for better searchability
const generateSearchText = (port) => {
  const searchTerms = [
    port.name,
    port.country,
    port.un_locode,
    port.type,
    port.continent
  ].filter(Boolean);
  
  return searchTerms.join(' ').toLowerCase().trim();
};

// Determine harbor size based on port type and name
const getHarborSize = (port) => {
  const name = port.name.toLowerCase();
  
  // Major international ports
  if (name.includes('rotterdam') || name.includes('singapore') || 
      name.includes('shanghai') || name.includes('los angeles') ||
      name.includes('hamburg') || name.includes('antwerp') ||
      name.includes('long beach') || name.includes('busan') ||
      name.includes('shenzhen') || name.includes('ningbo')) {
    return 'Large';
  }
  
  // Medium ports
  if (name.includes('port of') || name.includes('harbor') || 
      name.includes('terminal') || name.includes('marina')) {
    return 'Medium';
  }
  
  return 'Small';
};

// Determine harbor type based on port characteristics
const getHarborType = (port) => {
  const name = port.name.toLowerCase();
  
  if (name.includes('river') || name.includes('inland')) {
    return 'River (Natural)';
  }
  
  if (name.includes('marina') || name.includes('yacht')) {
    return 'Coastal (Natural)';
  }
  
  return 'Coastal (Artificial)';
};

// Escape SQL strings
const escapeSqlString = (str) => {
  if (!str) return 'NULL';
  return `'${str.replace(/'/g, "''")}'`;
};

async function importGlobalPorts() {
  try {
    console.log('🚢 Starting global ports import from JSON using SQL...');
    
    // Read the JSON file
    console.log('📄 Reading global_ports.json...');
    const jsonData = fs.readFileSync('Listofports/global_ports.json', 'utf8');
    const ports = JSON.parse(jsonData);
    
    console.log(`📊 Found ${ports.length} ports in JSON file`);
    
    // Clear existing ports first
    console.log('🗑️ Clearing existing ports...');
    const { error: deleteError } = await supabase.rpc('exec_sql', {
      sql: 'DELETE FROM ports;'
    });
    
    if (deleteError) {
      console.error('❌ Error clearing ports:', deleteError);
      throw deleteError;
    }
    
    console.log('✅ Existing ports cleared');
    
    // Insert ports in batches using SQL
    console.log('📥 Inserting ports using SQL...');
    const batchSize = 100;
    let totalInserted = 0;
    
    for (let i = 0; i < ports.length; i += batchSize) {
      const batch = ports.slice(i, i + batchSize);
      
      // Build SQL INSERT statement
      const values = batch.map((port, index) => {
        const globalIndex = i + index + 1;
        const countryCode = getCountryCode(port.un_locode);
        const searchText = generateSearchText(port);
        const harborSize = getHarborSize(port);
        const harborType = getHarborType(port);
        
        return `(
          ${globalIndex},
          ${escapeSqlString(port.continent)},
          ${escapeSqlString(port.name)},
          NULL,
          ${escapeSqlString(port.un_locode)},
          ${escapeSqlString(countryCode)},
          ${escapeSqlString(port.country)},
          NULL,
          NULL,
          ${port.latitude || 'NULL'},
          ${port.longitude || 'NULL'},
          ${escapeSqlString(harborSize)},
          ${escapeSqlString(harborType)},
          ${escapeSqlString(port.type === 'Seaport' ? 'Commercial' : 'Mixed')},
          'Good',
          NULL,
          NULL,
          NULL,
          NULL,
          NULL,
          NULL,
          NULL,
          NULL,
          true,
          true,
          true,
          true,
          true,
          ${port.type === 'Seaport' ? 'true' : 'false'},
          false,
          false,
          ${escapeSqlString(searchText)},
          NOW(),
          NOW()
        )`;
      }).join(',\n');
      
      const sql = `
        INSERT INTO ports (
          world_port_index, region_name, main_port_name, alternate_port_name,
          un_locode, country_code, country_name, world_water_body, iho_sea_area,
          latitude, longitude, harbor_size, harbor_type, harbor_use, shelter_afforded,
          tidal_range, entrance_width, channel_depth, anchorage_depth, cargo_pier_depth,
          max_vessel_length, max_vessel_beam, max_vessel_draft,
          pilotage_compulsory, pilotage_available, tugs_assistance,
          facilities_wharves, facilities_anchorage, facilities_container,
          facilities_oil_terminal, facilities_lng_terminal, search_text,
          created_at, updated_at
        ) VALUES ${values};
      `;
      
      try {
        const { error } = await supabase.rpc('exec_sql', { sql });
        
        if (error) {
          console.error(`❌ Error inserting batch ${i + 1}-${Math.min(i + batchSize, ports.length)}:`, error);
          throw error;
        }
        
        totalInserted += batch.length;
        console.log(`✅ Inserted batch ${i + 1}-${Math.min(i + batchSize, ports.length)} (${totalInserted}/${ports.length})`);
      } catch (error) {
        console.error(`❌ Failed to insert batch ${i + 1}-${Math.min(i + batchSize, ports.length)}:`, error);
        throw error;
      }
    }
    
    console.log('🎉 Global ports import completed successfully!');
    console.log(`📊 Total ports imported: ${totalInserted}`);
    
  } catch (error) {
    console.error('❌ Import failed:', error);
    throw error;
  }
}

// Run the import
importGlobalPorts()
  .then(() => {
    console.log('✅ Global ports import completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Global ports import failed:', error);
    process.exit(1);
  });
