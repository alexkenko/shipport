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

async function import10000Ports() {
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
    const { error: deleteError } = await supabase
      .from('ports')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
    
    if (deleteError) {
      console.error('❌ Error clearing ports:', deleteError);
      return;
    }
    
    console.log('✅ Existing ports cleared');
    
    // Import in batches of 100
    const batchSize = 100;
    let totalImported = 0;
    
    for (let i = 0; i < portsToImport.length; i += batchSize) {
      const batchValues = portsToImport.slice(i, i + batchSize);
      const batchNumber = Math.floor(i / batchSize) + 1;
      const totalBatches = Math.ceil(portsToImport.length / batchSize);
      
      console.log(`📦 Processing batch ${batchNumber}/${totalBatches} (${batchValues.length} ports)...`);
      
      // Parse each row into port data
      const ports = batchValues.map((row, index) => {
        try {
          // Clean up the row - it should already be cleaned from the split
          const cleanRow = row.trim();
          
          // Split by comma but respect quoted strings and parentheses
          const values = [];
          let currentValue = '';
          let inQuotes = false;
          let escapeNext = false;
          let parenCount = 0;
          
          for (let i = 0; i < cleanRow.length; i++) {
            const char = cleanRow[i];
            
            if (escapeNext) {
              currentValue += char;
              escapeNext = false;
              continue;
            }
            
            if (char === '\\') {
              escapeNext = true;
              currentValue += char;
              continue;
            }
            
            if (char === "'") {
              inQuotes = !inQuotes;
              currentValue += char;
              continue;
            }
            
            if (char === '(' && !inQuotes) {
              parenCount++;
              currentValue += char;
              continue;
            }
            
            if (char === ')' && !inQuotes) {
              parenCount--;
              currentValue += char;
              continue;
            }
            
            if (char === ',' && !inQuotes && parenCount === 0) {
              values.push(currentValue.trim());
              currentValue = '';
              continue;
            }
            
            currentValue += char;
          }
          
          // Push the last value
          if (currentValue) {
            values.push(currentValue.trim());
          }
          
          // Helper function to clean values
          const cleanValue = (val) => {
            if (!val || val === 'NULL') return null;
            // Remove surrounding quotes and handle escaped quotes
            return val.replace(/^'|'$/g, '').replace(/''/g, "'");
          };
          
          const parseFloatValue = (val) => {
            if (!val || val === 'NULL') return null;
            const cleaned = val.replace(/'/g, '').trim();
            return cleaned === 'NULL' ? null : parseFloat(cleaned);
          };
          
          const parseBoolValue = (val) => {
            return val === 'true';
          };
          
          if (values.length < 32) {
            console.warn(`⚠️ Skipping malformed row ${index + 1} in batch ${batchNumber} (${values.length} values)`);
            return null;
          }
          
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
          console.warn(`⚠️ Error parsing row ${index + 1} in batch ${batchNumber}:`, err.message);
          return null;
        }
      }).filter(Boolean);
      
      if (ports.length === 0) {
        console.warn(`⚠️ No valid ports in batch ${batchNumber}, skipping`);
        continue;
      }
      
      // Insert the ports
      const { error } = await supabase
        .from('ports')
        .insert(ports);
      
      if (error) {
        console.error(`❌ Error inserting batch ${batchNumber}:`, error);
        // Try individual inserts for this batch
        console.log(`🔄 Trying individual inserts for batch ${batchNumber}...`);
        for (const port of ports) {
          try {
            const { error: singleError } = await supabase
              .from('ports')
              .insert(port);
            if (!singleError) {
              totalImported++;
            }
          } catch (err) {
            console.warn(`⚠️ Failed to insert port: ${port.main_port_name}`);
          }
        }
      } else {
        totalImported += ports.length;
        console.log(`✅ Batch ${batchNumber} imported successfully`);
      }
    }
    
    console.log(`\n✅ Port import completed! Total imported: ${totalImported}`);
    
    // Verify the import
    console.log('🔍 Verifying import...');
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

// Run the import
console.log('⚠️  IMPORTANT: This script will import exactly 10,000 ports.');
console.log('⚠️  User accounts will NOT be touched.\n');

import10000Ports()
  .then(() => {
    console.log('\n✅ 10,000 ports import completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ 10,000 ports import failed:', error);
    process.exit(1);
  });
