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

async function importBatchedPorts() {
  try {
    console.log('🚢 Starting import of 116,182+ comprehensive ports...');
    
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
    
    // Read the SQL file
    console.log('📖 Reading SQL file...');
    const sqlContent = fs.readFileSync('sql/batched_geonames_ports.sql', 'utf8');
    
    // Extract the INSERT statement (skip the DELETE statement)
    const insertMatch = sqlContent.match(/INSERT INTO ports[^;]+;/s);
    if (!insertMatch) {
      console.error('❌ Could not find INSERT statement in SQL file');
      return;
    }
    
    const insertSQL = insertMatch[0];
    console.log('📝 Found INSERT statement, length:', insertSQL.length);
    
    // Execute the import
    console.log('🔄 Executing port import...');
    const { error: insertError } = await supabase.rpc('exec_sql', { sql: insertSQL });
    
    if (insertError) {
      console.error('❌ Error importing ports:', insertError);
      return;
    }
    
    console.log('✅ Port import completed successfully!');
    
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
importBatchedPorts()
  .then(() => {
    console.log('✅ Comprehensive port import completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Comprehensive port import failed:', error);
    process.exit(1);
  });
