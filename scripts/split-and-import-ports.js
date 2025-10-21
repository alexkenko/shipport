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

// Split the large SQL file into smaller chunks
function splitSQLFile() {
  console.log('📖 Reading large SQL file...');
  const sqlContent = fs.readFileSync('sql/batched_geonames_ports.sql', 'utf8');
  
  // Extract the INSERT statement
  const insertMatch = sqlContent.match(/INSERT INTO ports[^;]+;/s);
  if (!insertMatch) {
    console.error('❌ Could not find INSERT statement in SQL file');
    return null;
  }
  
  const insertSQL = insertMatch[0];
  console.log('📝 Found INSERT statement, length:', insertSQL.length);
  
  // Split by VALUES and process each batch
  const valuesMatch = insertSQL.match(/VALUES\s+(.+);/s);
  if (!valuesMatch) {
    console.error('❌ Could not find VALUES in INSERT statement');
    return null;
  }
  
  const valuesString = valuesMatch[1];
  const values = valuesString.split('),\n(');
  
  console.log(`📊 Found ${values.length} port records to import`);
  
  // Create chunks of 1000 ports each
  const chunkSize = 1000;
  const chunks = [];
  
  for (let i = 0; i < values.length; i += chunkSize) {
    const chunk = values.slice(i, i + chunkSize);
    const chunkSQL = `INSERT INTO ports (
  world_port_index, region_name, main_port_name, alternate_port_name,
  un_locode, country_code, country_name, world_water_body, iho_sea_area,
  latitude, longitude, harbor_size, harbor_type, harbor_use, shelter_afforded,
  tidal_range, entrance_width, channel_depth, anchorage_depth, cargo_pier_depth,
  max_vessel_length, max_vessel_beam, max_vessel_draft,
  pilotage_compulsory, pilotage_available, tugs_assistance,
  facilities_wharves, facilities_anchorage, facilities_container,
  facilities_oil_terminal, facilities_lng_terminal, search_text,
  created_at, updated_at
) VALUES (${chunk.join('),\n(')});`;
    
    chunks.push(chunkSQL);
  }
  
  console.log(`📦 Created ${chunks.length} chunks of ${chunkSize} ports each`);
  return chunks;
}

// Import ports in chunks
async function importPortsInChunks() {
  try {
    console.log('🚢 Starting chunked import of comprehensive ports...');
    
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
    
    // Split the SQL file
    const chunks = splitSQLFile();
    if (!chunks) {
      return;
    }
    
    // Import each chunk
    let totalImported = 0;
    for (let i = 0; i < chunks.length; i++) {
      console.log(`📦 Importing chunk ${i + 1}/${chunks.length}...`);
      
      try {
        // Use raw SQL execution
        const { error } = await supabase.rpc('exec_sql', { sql: chunks[i] });
        
        if (error) {
          console.error(`❌ Error importing chunk ${i + 1}:`, error);
          // Try alternative method - parse and insert as data
          await importChunkAsData(chunks[i], i + 1);
        } else {
          totalImported += 1000; // Approximate
          console.log(`✅ Chunk ${i + 1} imported successfully`);
        }
      } catch (err) {
        console.error(`❌ Error with chunk ${i + 1}:`, err);
        // Try alternative method
        await importChunkAsData(chunks[i], i + 1);
      }
    }
    
    console.log(`✅ Port import completed! Total imported: ${totalImported}`);
    
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

// Alternative method: parse chunk and insert as data
async function importChunkAsData(chunkSQL, chunkNumber) {
  try {
    console.log(`🔄 Trying alternative import method for chunk ${chunkNumber}...`);
    
    // Extract values from the chunk
    const valuesMatch = chunkSQL.match(/VALUES\s+(.+);/s);
    if (!valuesMatch) {
      console.error(`❌ Could not parse values from chunk ${chunkNumber}`);
      return;
    }
    
    const valuesString = valuesMatch[1];
    const valueRows = valuesString.split('),\n(');
    
    // Parse each row into port data
    const ports = valueRows.map(row => {
      // Clean up the row
      const cleanRow = row.replace(/^\(/, '').replace(/\)$/, '');
      const values = cleanRow.split(',\n    ');
      
      if (values.length < 32) {
        console.warn(`⚠️ Skipping malformed row in chunk ${chunkNumber}`);
        return null;
      }
      
      return {
        world_port_index: values[0] === 'NULL' ? null : values[0].replace(/'/g, ''),
        region_name: values[1] === 'NULL' ? null : values[1].replace(/'/g, ''),
        main_port_name: values[2].replace(/'/g, ''),
        alternate_port_name: values[3] === 'NULL' ? null : values[3].replace(/'/g, ''),
        un_locode: values[4] === 'NULL' ? null : values[4].replace(/'/g, ''),
        country_code: values[5] === 'NULL' ? null : values[5].replace(/'/g, ''),
        country_name: values[6] === 'NULL' ? null : values[6].replace(/'/g, ''),
        world_water_body: values[7] === 'NULL' ? null : values[7].replace(/'/g, ''),
        iho_sea_area: values[8] === 'NULL' ? null : values[8].replace(/'/g, ''),
        latitude: values[9] === 'NULL' ? null : parseFloat(values[9]),
        longitude: values[10] === 'NULL' ? null : parseFloat(values[10]),
        harbor_size: values[11] === 'NULL' ? null : values[11].replace(/'/g, ''),
        harbor_type: values[12] === 'NULL' ? null : values[12].replace(/'/g, ''),
        harbor_use: values[13] === 'NULL' ? null : values[13].replace(/'/g, ''),
        shelter_afforded: values[14] === 'NULL' ? null : values[14].replace(/'/g, ''),
        tidal_range: values[15] === 'NULL' ? null : parseFloat(values[15]),
        entrance_width: values[16] === 'NULL' ? null : parseFloat(values[16]),
        channel_depth: values[17] === 'NULL' ? null : parseFloat(values[17]),
        anchorage_depth: values[18] === 'NULL' ? null : parseFloat(values[18]),
        cargo_pier_depth: values[19] === 'NULL' ? null : parseFloat(values[19]),
        max_vessel_length: values[20] === 'NULL' ? null : parseFloat(values[20]),
        max_vessel_beam: values[21] === 'NULL' ? null : parseFloat(values[21]),
        max_vessel_draft: values[22] === 'NULL' ? null : parseFloat(values[22]),
        pilotage_compulsory: values[23] === 'true',
        pilotage_available: values[24] === 'true',
        tugs_assistance: values[25] === 'true',
        facilities_wharves: values[26] === 'true',
        facilities_anchorage: values[27] === 'true',
        facilities_container: values[28] === 'true',
        facilities_oil_terminal: values[29] === 'true',
        facilities_lng_terminal: values[30] === 'true',
        search_text: values[31] === 'NULL' ? null : values[31].replace(/'/g, '')
      };
    }).filter(Boolean);
    
    // Insert the ports
    const { error } = await supabase
      .from('ports')
      .insert(ports);
    
    if (error) {
      console.error(`❌ Error inserting chunk ${chunkNumber} as data:`, error);
    } else {
      console.log(`✅ Chunk ${chunkNumber} imported as data successfully`);
    }
    
  } catch (err) {
    console.error(`❌ Error with alternative import for chunk ${chunkNumber}:`, err);
  }
}

// Run the import
importPortsInChunks()
  .then(() => {
    console.log('✅ Comprehensive port import completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Comprehensive port import failed:', error);
    process.exit(1);
  });
