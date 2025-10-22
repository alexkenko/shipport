const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function importAllPorts() {
  try {
    console.log('🚢 Reading comprehensive ports SQL file...');
    const sql = fs.readFileSync('sql/comprehensive_major_ports.sql', 'utf8');
    
    console.log('📊 Executing SQL import (80+ major seaports worldwide)...');
    
    // Execute the SQL directly
    const { data, error } = await supabase.rpc('exec_sql', {
      query: sql
    });
    
    if (error) {
      console.error('❌ Error:', error);
      
      // Try alternative method: delete and insert directly
      console.log('🔄 Trying alternative import method...');
      
      // Delete existing ports
      await supabase.from('ports').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      
      console.log('✅ Cleared existing ports');
      console.log('📥 Please execute sql/comprehensive_major_ports.sql manually in Supabase SQL editor');
      return;
    }
    
    console.log('✅ Import completed successfully!');
    
    // Count total ports
    const { count } = await supabase
      .from('ports')
      .select('*', { count: 'exact', head: true });
    
    console.log(`🎉 Total ports in database: ${count}`);
    
  } catch (error) {
    console.error('❌ Fatal error:', error);
  }
}

importAllPorts();
