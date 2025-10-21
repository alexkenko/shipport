const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Supabase environment variables are not set.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

// Get a sample of the most important ports (first 5000)
async function importSamplePorts() {
  try {
    console.log('🚢 Starting import of sample comprehensive ports...');
    
    // First, clear existing ports
    console.log('🧹 Clearing existing ports...');
    const { error: deleteError } = await supabase
      .from('ports')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
    
    if (deleteError) {
      console.error('❌ Error clearing ports:', deleteError);
      return;
    }
    
    console.log('✅ Existing ports cleared');
    
    // Read the SQL file and get first 5000 ports
    console.log('📖 Reading SQL file and extracting sample...');
    const sqlContent = fs.readFileSync('sql/batched_geonames_ports.sql', 'utf8');
    
    // Extract the INSERT statement
    const insertMatch = sqlContent.match(/INSERT INTO ports[^;]+;/s);
    if (!insertMatch) {
      console.error('❌ Could not find INSERT statement in SQL file');
      return;
    }
    
    const insertSQL = insertMatch[0];
    
    // Extract values and take first 5000
    const valuesMatch = insertSQL.match(/VALUES\s+(.+);/s);
    if (!valuesMatch) {
      console.error('❌ Could not find VALUES in INSERT statement');
      return;
    }
    
    const valuesString = valuesMatch[1];
    const allValues = valuesString.split('),\n(');
    
    // Take first 5000 ports
    const sampleValues = allValues.slice(0, 5000);
    console.log(`📊 Selected ${sampleValues.length} sample ports`);
    
    // Create sample SQL
    const sampleSQL = `INSERT INTO ports (
  world_port_index, region_name, main_port_name, alternate_port_name,
  un_locode, country_code, country_name, world_water_body, iho_sea_area,
  latitude, longitude, harbor_size, harbor_type, harbor_use, shelter_afforded,
  tidal_range, entrance_width, channel_depth, anchorage_depth, cargo_pier_depth,
  max_vessel_length, max_vessel_beam, max_vessel_draft,
  pilotage_compulsory, pilotage_available, tugs_assistance,
  facilities_wharves, facilities_anchorage, facilities_container,
  facilities_oil_terminal, facilities_lng_terminal, search_text,
  created_at, updated_at
) VALUES (${sampleValues.join('),\n(')});`;
    
    // Write sample SQL to file
    fs.writeFileSync('sql/sample_ports.sql', sampleSQL);
    console.log('📄 Sample SQL written to sql/sample_ports.sql');
    
    // Import the sample
    console.log('🔄 Importing sample ports...');
    
    // Parse and insert as data instead of raw SQL
    const ports = sampleValues.map((row, index) => {
      try {
        // Clean up the row
        const cleanRow = row.replace(/^\(/, '').replace(/\)$/, '');
        const values = cleanRow.split(',');
        
        if (values.length < 32) {
          console.warn(`⚠️ Skipping malformed row ${index + 1}`);
          return null;
        }
        
        // Helper function to clean values
        const cleanValue = (val) => {
          if (val === 'NULL') return null;
          return val.replace(/'/g, '').trim();
        };
        
        const parseFloatValue = (val) => {
          if (val === 'NULL') return null;
          const cleaned = val.replace(/'/g, '').trim();
          return cleaned === 'NULL' ? null : parseFloat(cleaned);
        };
        
        const parseBoolValue = (val) => {
          return val === 'true';
        };
        
        return {
          world_port_index: cleanValue(values[0]),
          region_name: cleanValue(values[1]),
          main_port_name: cleanValue(values[2]),
          alternate_port_name: cleanValue(values[3]),
          un_locode: cleanValue(values[4]),
          country_code: cleanValue(values[5]),
          country_name: cleanValue(values[6]),
          world_water_body: cleanValue(values[7]),
          iho_sea_area: cleanValue(values[8]),
          latitude: parseFloatValue(values[9]),
          longitude: parseFloatValue(values[10]),
          harbor_size: cleanValue(values[11]),
          harbor_type: cleanValue(values[12]),
          harbor_use: cleanValue(values[13]),
          shelter_afforded: cleanValue(values[14]),
          tidal_range: parseFloatValue(values[15]),
          entrance_width: parseFloatValue(values[16]),
          channel_depth: parseFloatValue(values[17]),
          anchorage_depth: parseFloatValue(values[18]),
          cargo_pier_depth: parseFloatValue(values[19]),
          max_vessel_length: parseFloatValue(values[20]),
          max_vessel_beam: parseFloatValue(values[21]),
          max_vessel_draft: parseFloatValue(values[22]),
          pilotage_compulsory: parseBoolValue(values[23]),
          pilotage_available: parseBoolValue(values[24]),
          tugs_assistance: parseBoolValue(values[25]),
          facilities_wharves: parseBoolValue(values[26]),
          facilities_anchorage: parseBoolValue(values[27]),
          facilities_container: parseBoolValue(values[28]),
          facilities_oil_terminal: parseBoolValue(values[29]),
          facilities_lng_terminal: parseBoolValue(values[30]),
          search_text: cleanValue(values[31])
        };
      } catch (err) {
        console.warn(`⚠️ Error parsing row ${index + 1}:`, err.message);
        return null;
      }
    }).filter(Boolean);
    
    console.log(`📊 Parsed ${ports.length} valid port records`);
    
    // Insert in batches of 100
    const batchSize = 100;
    let totalInserted = 0;
    
    for (let i = 0; i < ports.length; i += batchSize) {
      const batch = ports.slice(i, i + batchSize);
      
      console.log(`📦 Inserting batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(ports.length / batchSize)}...`);
      
      const { error } = await supabase
        .from('ports')
        .insert(batch);
      
      if (error) {
        console.error(`❌ Error inserting batch ${Math.floor(i / batchSize) + 1}:`, error);
      } else {
        totalInserted += batch.length;
        console.log(`✅ Batch ${Math.floor(i / batchSize) + 1} inserted successfully`);
      }
    }
    
    console.log(`✅ Sample port import completed! Total inserted: ${totalInserted}`);
    
    // Verify the import
    console.log('🔍 Verifying import...');
    const { count, error: countError } = await supabase
      .from('ports')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('❌ Error counting ports:', countError);
      return;
    }
    
    console.log(`📊 Successfully imported ${count} ports!`);
    
  } catch (error) {
    console.error('❌ Import failed:', error);
    throw error;
  }
}

// Run the import
importSamplePorts()
  .then(() => {
    console.log('✅ Sample port import completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Sample port import failed:', error);
    process.exit(1);
  });
