const fs = require('fs');
const path = require('path');

async function executeImportantPorts() {
  try {
    console.log('🚢 Starting import of important ports...');
    
    // Read the SQL file
    const sqlFilePath = path.join(__dirname, '..', 'sql', 'important_3000_ports.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    console.log(`📄 SQL file size: ${(sqlContent.length / 1024 / 1024).toFixed(2)} MB`);
    
    // Split into chunks of 50 ports each to avoid timeout
    const lines = sqlContent.split('\n');
    const insertLine = lines.find(line => line.trim().startsWith('INSERT INTO ports'));
    
    if (!insertLine) {
      throw new Error('Could not find INSERT statement');
    }
    
    // Find the VALUES section
    const valuesMatch = sqlContent.match(/VALUES\s+([\s\S]+)/);
    if (!valuesMatch) {
      throw new Error('Could not find VALUES section');
    }
    
    const valuesContent = valuesMatch[1].trim();
    
    // Remove trailing semicolon and split by '), (' pattern
    const cleanValues = valuesContent.replace(/;\s*$/, '');
    const portEntries = cleanValues.split(/\),\s*\(/);
    
    console.log(`🔍 Found ${portEntries.length} port entries`);
    
    // Process in batches of 50
    const batchSize = 50;
    const totalBatches = Math.ceil(portEntries.length / batchSize);
    
    console.log(`📦 Processing ${totalBatches} batches of ${batchSize} ports each`);
    
    for (let i = 0; i < totalBatches; i++) {
      const start = i * batchSize;
      const end = Math.min(start + batchSize, portEntries.length);
      const batch = portEntries.slice(start, end);
      
      // Clean up each entry
      const cleanedBatch = batch.map((entry, index) => {
        let cleaned = entry.trim();
        
        // Add opening parenthesis to first entry if missing
        if (index === 0 && !cleaned.startsWith('(')) {
          cleaned = '(' + cleaned;
        }
        
        // Add closing parenthesis to last entry if missing
        if (index === batch.length - 1 && !cleaned.endsWith(')')) {
          cleaned = cleaned + ')';
        }
        
        return cleaned;
      });
      
      const batchSql = `INSERT INTO ports (
        world_port_index, region_name, main_port_name, alternate_port_name,
        un_locode, country_code, country_name, world_water_body, iho_sea_area,
        latitude, longitude, harbor_size, harbor_type, harbor_use, shelter_afforded,
        tidal_range, entrance_width, channel_depth, anchorage_depth, cargo_pier_depth,
        max_vessel_length, max_vessel_beam, max_vessel_draft,
        pilotage_compulsory, pilotage_available, tugs_assistance,
        facilities_wharves, facilities_anchorage, facilities_container,
        facilities_oil_terminal, facilities_lng_terminal, search_text,
        created_at, updated_at
      ) VALUES ${cleanedBatch.join(', ')};`;
      
      try {
        console.log(`📤 Executing batch ${i + 1}/${totalBatches} (ports ${start + 1}-${end})...`);
        
    // Execute the batch
    const response = await fetch(process.env.SUPABASE_REST_EXECUTE_SQL_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY
          },
          body: JSON.stringify({ query: batchSql })
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`❌ Batch ${i + 1} failed:`, errorText);
          continue;
        }
        
        console.log(`✅ Batch ${i + 1} completed successfully`);
        
        // Small delay between batches
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error(`❌ Error in batch ${i + 1}:`, error.message);
        continue;
      }
    }
    
    console.log('🎉 Import completed!');
    
  } catch (error) {
    console.error('❌ Import failed:', error);
  }
}

executeImportantPorts();
