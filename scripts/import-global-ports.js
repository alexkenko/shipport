const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase client strictly from env vars
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing required environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

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
  const country = port.country.toLowerCase();
  
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

async function importGlobalPorts() {
  try {
    console.log('🚢 Starting global ports import from JSON...');
    
    // Read the JSON file
    console.log('📄 Reading global_ports.json...');
    const jsonData = fs.readFileSync('Listofports/global_ports.json', 'utf8');
    const ports = JSON.parse(jsonData);
    
    console.log(`📊 Found ${ports.length} ports in JSON file`);
    
    // Transform the data to match our database schema
    const transformedPorts = ports.map((port, index) => ({
      world_port_index: (index + 1).toString(),
      region_name: port.continent || null,
      main_port_name: port.name || 'Unknown Port',
      alternate_port_name: null,
      un_locode: port.un_locode || null,
      country_code: getCountryCode(port.un_locode),
      country_name: port.country || null,
      world_water_body: null, // Not available in JSON
      iho_sea_area: null, // Not available in JSON
      latitude: port.latitude || null,
      longitude: port.longitude || null,
      harbor_size: getHarborSize(port),
      harbor_type: getHarborType(port),
      harbor_use: port.type === 'Seaport' ? 'Commercial' : 'Mixed',
      shelter_afforded: 'Good', // Default assumption
      tidal_range: null, // Not available in JSON
      entrance_width: null, // Not available in JSON
      channel_depth: null, // Not available in JSON
      anchorage_depth: null, // Not available in JSON
      cargo_pier_depth: null, // Not available in JSON
      max_vessel_length: null, // Not available in JSON
      max_vessel_beam: null, // Not available in JSON
      max_vessel_draft: null, // Not available in JSON
      pilotage_compulsory: true, // Default for major ports
      pilotage_available: true, // Default for major ports
      tugs_assistance: true, // Default for major ports
      facilities_wharves: true, // Default for major ports
      facilities_anchorage: true, // Default for major ports
      facilities_container: port.type === 'Seaport', // Container facilities for seaports
      facilities_oil_terminal: false, // Not specified in JSON
      facilities_lng_terminal: false, // Not specified in JSON
      search_text: generateSearchText(port)
    }));
    
    console.log(`🔄 Transformed ${transformedPorts.length} ports for database import`);
    
    // Clear existing ports
    console.log('🗑️ Clearing existing ports...');
    const { error: deleteError } = await supabase
      .from('ports')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
    
    if (deleteError) {
      console.error('❌ Error clearing ports:', deleteError);
      throw deleteError;
    }
    
    console.log('✅ Existing ports cleared');
    
    // Insert ports in batches
    console.log('📥 Inserting ports in batches...');
    const batchSize = 1000;
    let totalInserted = 0;
    
    for (let i = 0; i < transformedPorts.length; i += batchSize) {
      const batch = transformedPorts.slice(i, i + batchSize);
      
      try {
        const { error } = await supabase
          .from('ports')
          .insert(batch);
        
        if (error) {
          console.error(`❌ Error inserting batch ${i + 1}-${Math.min(i + batchSize, transformedPorts.length)}:`, error);
          throw error;
        }
        
        totalInserted += batch.length;
        console.log(`✅ Inserted batch ${i + 1}-${Math.min(i + batchSize, transformedPorts.length)} (${totalInserted}/${transformedPorts.length})`);
      } catch (error) {
        console.error(`❌ Failed to insert batch ${i + 1}-${Math.min(i + batchSize, transformedPorts.length)}:`, error);
        throw error;
      }
    }
    
    console.log('🎉 Global ports import completed successfully!');
    console.log(`📊 Total ports imported: ${totalInserted}`);
    
    // Verify the import
    const { data: countData, error: countError } = await supabase
      .from('ports')
      .select('id', { count: 'exact', head: true });
    
    if (!countError) {
      console.log(`✅ Verification: ${countData?.length || 0} ports in database`);
    }
    
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
