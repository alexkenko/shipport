const fs = require('fs');
const path = require('path');

async function importAsianPorts() {
  try {
    console.log('🚢 Starting import of Asian ports (China, Japan, South Korea, Philippines, Malaysia, Indonesia, Singapore)...');
    
    // Read the comprehensive SQL file
    const sqlFilePath = path.join(__dirname, '..', 'sql', 'batched_geonames_ports.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    console.log(`📄 SQL file size: ${(sqlContent.length / 1024 / 1024).toFixed(2)} MB`);
    
    // Target countries
    const targetCountries = ['China', 'Japan', 'South Korea', 'Philippines', 'Malaysia', 'Indonesia', 'Singapore'];
    const countryCodes = ['CN', 'JP', 'KR', 'PH', 'MY', 'ID', 'SG'];
    
    // Find the VALUES section
    const valuesMatch = sqlContent.match(/VALUES\s+([\s\S]+)/);
    if (!valuesMatch) {
      throw new Error('Could not find VALUES section');
    }
    
    const valuesContent = valuesMatch[1].trim();
    const cleanValues = valuesContent.replace(/;\s*$/, '');
    const portEntries = cleanValues.split(/\),\s*\(/);
    
    console.log(`🔍 Found ${portEntries.length} total port entries`);
    
    // Filter for target countries
    const asianPorts = [];
    
    for (const entry of portEntries) {
      // Extract country from the entry - look for country code and country name
      const countryMatch = entry.match(/'([A-Z]{2})',\s*'([^']+)'/);
      if (countryMatch) {
        const countryCode = countryMatch[1];
        const countryName = countryMatch[2];
        
        if (countryCodes.includes(countryCode) || targetCountries.includes(countryName)) {
          asianPorts.push(entry);
        }
      }
    }
    
    console.log(`🌏 Found ${asianPorts.length} ports from target Asian countries`);
    
    if (asianPorts.length === 0) {
      console.log('❌ No ports found for target countries');
      return;
    }
    
    // Show breakdown by country
    const countryBreakdown = {};
    for (const entry of asianPorts) {
      const countryMatch = entry.match(/'([A-Z]{2})',\s*'([^']+)'/);
      if (countryMatch) {
        const countryName = countryMatch[2];
        countryBreakdown[countryName] = (countryBreakdown[countryName] || 0) + 1;
      }
    }
    
    console.log('📊 Port breakdown by country:');
    Object.entries(countryBreakdown).forEach(([country, count]) => {
      console.log(`   ${country}: ${count} ports`);
    });
    
    // Process in batches of 50
    const batchSize = 50;
    const totalBatches = Math.ceil(asianPorts.length / batchSize);
    
    console.log(`📦 Processing ${totalBatches} batches of ${batchSize} ports each`);
    
    for (let i = 0; i < totalBatches; i++) {
      const start = i * batchSize;
      const end = Math.min(start + batchSize, asianPorts.length);
      const batch = asianPorts.slice(start, end);
      
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
        const batchFileName = `sql/asian_ports_batch_${String(i + 1).padStart(3, '0')}.sql`;
        fs.writeFileSync(batchFileName, batchSql);
        
        console.log(`✅ Batch ${i + 1} written to ${batchFileName}`);
        
      } catch (error) {
        console.error(`❌ Error in batch ${i + 1}:`, error.message);
        continue;
      }
    }
    
    // Create a summary file
    const summarySql = `-- Asian Ports Import Summary
-- Countries: China, Japan, South Korea, Philippines, Malaysia, Indonesia, Singapore
-- Total ports: ${asianPorts.length}
-- Generated: ${new Date().toISOString()}

-- Country breakdown:
${Object.entries(countryBreakdown).map(([country, count]) => `-- ${country}: ${count} ports`).join('\n')}

-- Execute all batch files in order:
${Array.from({length: totalBatches}, (_, i) => `-- sql/asian_ports_batch_${String(i + 1).padStart(3, '0')}.sql`).join('\n')}
`;
    
    fs.writeFileSync('sql/asian_ports_summary.sql', summarySql);
    
    console.log('🎉 Asian ports preparation completed!');
    console.log(`📁 Created ${totalBatches} batch files`);
    console.log('📋 Execute the batch files to import all Asian ports');
    
  } catch (error) {
    console.error('❌ Import preparation failed:', error);
  }
}

importAsianPorts();
