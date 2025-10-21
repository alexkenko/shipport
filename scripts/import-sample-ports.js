const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Supabase environment variables are not set.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function importSamplePorts() {
  try {
    console.log('🚢 Importing sample ports to test schema...');
    
    // Sample port data
    const samplePorts = [
      {
        world_port_index: '291696',
        region_name: null,
        main_port_name: 'Khawr Fakkān',
        alternate_port_name: 'Khawr Fakkan',
        un_locode: null,
        country_code: 'AE',
        country_name: 'United Arab Emirates',
        world_water_body: null,
        iho_sea_area: null,
        latitude: 25.33132,
        longitude: 56.34199,
        harbor_size: 'Medium',
        harbor_type: 'Coastal (Natural)',
        harbor_use: 'Commercial',
        shelter_afforded: 'Good',
        tidal_range: null,
        entrance_width: null,
        channel_depth: null,
        anchorage_depth: null,
        cargo_pier_depth: null,
        max_vessel_length: null,
        max_vessel_beam: null,
        max_vessel_draft: null,
        pilotage_compulsory: false,
        pilotage_available: true,
        tugs_assistance: true,
        facilities_wharves: true,
        facilities_anchorage: true,
        facilities_container: false,
        facilities_oil_terminal: false,
        facilities_lng_terminal: false,
        search_text: 'khawr fakkān khawr fakkan united arab emirates ae'
      },
      {
        world_port_index: '8225949',
        region_name: null,
        main_port_name: 'Būr Saʻīd',
        alternate_port_name: 'Bur Sa\'id',
        un_locode: null,
        country_code: 'EG',
        country_name: 'Egypt',
        world_water_body: null,
        iho_sea_area: null,
        latitude: 31.265,
        longitude: 32.307,
        harbor_size: 'Large',
        harbor_type: 'Coastal (Natural)',
        harbor_use: 'Commercial',
        shelter_afforded: 'Good',
        tidal_range: null,
        entrance_width: null,
        channel_depth: null,
        anchorage_depth: null,
        cargo_pier_depth: null,
        max_vessel_length: null,
        max_vessel_beam: null,
        max_vessel_draft: null,
        pilotage_compulsory: false,
        pilotage_available: true,
        tugs_assistance: true,
        facilities_wharves: true,
        facilities_anchorage: true,
        facilities_container: false,
        facilities_oil_terminal: false,
        facilities_lng_terminal: false,
        search_text: 'būr saʻīd bur sa\'id egypt eg'
      }
    ];
    
    console.log(`📦 Inserting ${samplePorts.length} sample ports...`);
    
    const { data, error } = await supabase
      .from('ports')
      .insert(samplePorts);
    
    if (error) {
      console.error('❌ Error inserting sample ports:', error);
      return;
    }
    
    console.log('✅ Sample ports inserted successfully!');
    
    // Verify the import
    const { count, error: countError } = await supabase
      .from('ports')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('❌ Error counting ports:', countError);
      return;
    }
    
    console.log(`📊 Database now contains ${count} ports!`);
    
  } catch (error) {
    console.error('❌ Import failed:', error);
    throw error;
  }
}

console.log('⚠️  IMPORTANT: This script ONLY modifies the ports table.');
console.log('⚠️  User accounts will NOT be touched.\n');

importSamplePorts()
  .then(() => {
    console.log('\n✅ Sample port import completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Sample port import failed:', error);
    process.exit(1);
  });