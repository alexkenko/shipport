const fs = require('fs');
const path = require('path');

async function importMajorPortsWorldwide() {
  try {
    console.log('🚢 Starting import of MAJOR ports worldwide...');
    
    // Read the comprehensive SQL file
    const sqlFilePath = path.join(__dirname, '..', 'sql', 'batched_geonames_ports.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    console.log(`📄 SQL file size: ${(sqlContent.length / 1024 / 1024).toFixed(2)} MB`);
    
    // Find the VALUES section
    const valuesMatch = sqlContent.match(/VALUES\s+([\s\S]+)/);
    if (!valuesMatch) {
      throw new Error('Could not find VALUES section');
    }
    
    const valuesContent = valuesMatch[1].trim();
    const cleanValues = valuesContent.replace(/;\s*$/, '');
    const portEntries = cleanValues.split(/\),\s*\(/);
    
    console.log(`🔍 Found ${portEntries.length} total port entries`);
    
    // Filter for only Large ports worldwide
    const majorPorts = [];
    
    for (const entry of portEntries) {
      // Extract harbor size from the entry
      const sizeMatch = entry.match(/'Large'/);
      
      if (sizeMatch) {
        majorPorts.push(entry);
      }
    }
    
    console.log(`🌍 Found ${majorPorts.length} MAJOR ports worldwide`);
    
    if (majorPorts.length === 0) {
      console.log('❌ No major ports found');
      return;
    }
    
    // Show breakdown by country
    const countryBreakdown = {};
    for (const entry of majorPorts) {
      const countryMatch = entry.match(/'([A-Z]{2})',\s*'([^']+)'/);
      if (countryMatch) {
        const countryName = countryMatch[2];
        countryBreakdown[countryName] = (countryBreakdown[countryName] || 0) + 1;
      }
    }
    
    console.log('📊 MAJOR Port breakdown by country (top 20):');
    Object.entries(countryBreakdown)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 20)
      .forEach(([country, count]) => {
        console.log(`   ${country}: ${count} major ports`);
      });
    
    // Process in batches of 50
    const batchSize = 50;
    const totalBatches = Math.ceil(majorPorts.length / batchSize);
    
    console.log(`📦 Processing ${totalBatches} batches of ${batchSize} ports each`);
    
    for (let i = 0; i < totalBatches; i++) {
      const start = i * batchSize;
      const end = Math.min(start + batchSize, majorPorts.length);
      const batch = majorPorts.slice(start, end);
      
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
        console.log(`📤 Creating batch ${i + 1}/${totalBatches} (ports ${start + 1}-${end})...`);
        
        // Write batch to file for manual execution
        const batchFileName = `sql/major_ports_worldwide_batch_${String(i + 1).padStart(3, '0')}.sql`;
        fs.writeFileSync(batchFileName, batchSql);
        
        console.log(`✅ Batch ${i + 1} written to ${batchFileName}`);
        
      } catch (error) {
        console.error(`❌ Error in batch ${i + 1}:`, error.message);
        continue;
      }
    }
    
    // Create a summary file
    const summarySql = `-- MAJOR Ports Worldwide Import Summary
-- Filter: Only LARGE ports from all countries
-- Total MAJOR ports: ${majorPorts.length}
-- Generated: ${new Date().toISOString()}

-- Top countries breakdown:
${Object.entries(countryBreakdown)
  .sort(([,a], [,b]) => b - a)
  .slice(0, 20)
  .map(([country, count]) => `-- ${country}: ${count} major ports`)
  .join('\n')}

-- Execute all batch files in order:
${Array.from({length: totalBatches}, (_, i) => `-- sql/major_ports_worldwide_batch_${String(i + 1).padStart(3, '0')}.sql`).join('\n')}
`;
    
    fs.writeFileSync('sql/major_ports_worldwide_summary.sql', summarySql);
    
    console.log('🎉 MAJOR ports worldwide preparation completed!');
    console.log(`📁 Created ${totalBatches} batch files`);
    console.log('📋 Execute the batch files to import all MAJOR ports worldwide');
    
  } catch (error) {
    console.error('❌ Import preparation failed:', error);
  }
}

importMajorPortsWorldwide();
