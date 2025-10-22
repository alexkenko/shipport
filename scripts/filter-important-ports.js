const fs = require('fs');
const path = require('path');

// Script to filter and import only important maritime ports
async function filterImportantPorts() {
  console.log('🌊 Filtering for important maritime ports only...');
  
  // Define important maritime countries (major shipping nations)
  const importantCountries = [
    'CN', 'US', 'SG', 'NL', 'DE', 'GB', 'JP', 'KR', 'HK', 'MY', 'TH', 'VN', 'ID', 'PH', 'IN', 'BD', 'PK', 'LK',
    'FR', 'IT', 'ES', 'BE', 'DK', 'NO', 'SE', 'FI', 'PL', 'RU', 'TR', 'GR', 'EG', 'SA', 'AE', 'QA', 'KW', 'BH',
    'BR', 'AR', 'CL', 'CO', 'PE', 'UY', 'VE', 'MX', 'CA', 'AU', 'NZ', 'ZA', 'NG', 'GH', 'KE', 'TZ', 'MA', 'TN',
    'DZ', 'LY', 'EG', 'IL', 'LB', 'JO', 'SY', 'IQ', 'IR', 'OM', 'YE', 'SO', 'DJ', 'ET', 'SD', 'ER', 'SS'
  ];
  
  // Define important port types/keywords
  const importantKeywords = [
    'port', 'harbor', 'harbour', 'terminal', 'dock', 'pier', 'wharf', 'quay', 'marina', 'seaport',
    'container', 'cargo', 'shipping', 'maritime', 'coastal', 'bay', 'gulf', 'strait', 'canal',
    'freeport', 'zones', 'industrial', 'commercial', 'logistics', 'trade', 'export', 'import'
  ];
  
  console.log(`🎯 Targeting ${importantCountries.length} important maritime countries`);
  
  const batchesDir = 'sql';
  const cleanBatchFiles = fs.readdirSync(batchesDir)
    .filter(file => file.startsWith('clean_unlocode_batch_') && file.endsWith('.sql'))
    .sort();
  
  console.log(`📦 Processing ${cleanBatchFiles.length} batch files...`);
  
  let totalFiltered = 0;
  let importantPorts = [];
  
  for (let i = 0; i < cleanBatchFiles.length; i++) {
    const batchFile = cleanBatchFiles[i];
    const batchPath = path.join(batchesDir, batchFile);
    
    try {
      console.log(`📦 Processing ${batchFile} (${i + 1}/${cleanBatchFiles.length})...`);
      
      const sqlContent = fs.readFileSync(batchPath, 'utf8');
      
      // Extract port entries
      const valuesMatch = sqlContent.match(/VALUES\s+([\s\S]+);/);
      if (!valuesMatch) continue;
      
      const valuesContent = valuesMatch[1];
      const lines = valuesContent.split('\n');
      const portEntries = lines.filter(line => line.trim() && line.includes('('));
      
      // Filter ports
      const filteredPorts = portEntries.filter(entry => {
        // Extract country code from the entry
        const countryMatch = entry.match(/'([A-Z]{2})'/);
        if (!countryMatch) return false;
        
        const countryCode = countryMatch[1];
        
        // Check if it's an important country
        if (!importantCountries.includes(countryCode)) return false;
        
        // Check for important keywords in port name or search text
        const entryLower = entry.toLowerCase();
        const hasImportantKeyword = importantKeywords.some(keyword => 
          entryLower.includes(keyword)
        );
        
        return hasImportantKeyword;
      });
      
      importantPorts.push(...filteredPorts);
      totalFiltered += filteredPorts.length;
      
      console.log(`✅ Found ${filteredPorts.length} important ports in ${batchFile}`);
      
    } catch (error) {
      console.error(`❌ Error processing ${batchFile}:`, error.message);
    }
  }
  
  console.log(`🎉 Filtering complete!`);
  console.log(`📊 Total important ports found: ${totalFiltered}`);
  
  // Create SQL file with filtered ports
  if (importantPorts.length > 0) {
    const outputFile = 'sql/important_maritime_ports.sql';
    
    let sqlContent = '-- Important Maritime Ports Only\n';
    sqlContent += '-- Filtered from UN/LOCODE data for major shipping nations\n\n';
    sqlContent += 'INSERT INTO ports (\n';
    sqlContent += '    world_port_index, region_name, main_port_name, alternate_port_name,\n';
    sqlContent += '    un_locode, country_code, country_name, world_water_body, iho_sea_area,\n';
    sqlContent += '    latitude, longitude, harbor_size, harbor_type, harbor_use, shelter_afforded,\n';
    sqlContent += '    tidal_range, entrance_width, channel_depth, anchorage_depth, cargo_pier_depth,\n';
    sqlContent += '    max_vessel_length, max_vessel_beam, max_vessel_draft,\n';
    sqlContent += '    pilotage_compulsory, pilotage_available, tugs_assistance,\n';
    sqlContent += '    facilities_wharves, facilities_anchorage, facilities_container,\n';
    sqlContent += '    facilities_oil_terminal, facilities_lng_terminal, search_text,\n';
    sqlContent += '    created_at, updated_at\n';
    sqlContent += ') VALUES\n';
    sqlContent += importantPorts.join(',\n') + ';\n';
    
    fs.writeFileSync(outputFile, sqlContent);
    console.log(`✅ Created filtered SQL file: ${outputFile}`);
    console.log(`📊 Ready to import ${importantPorts.length} important maritime ports`);
  }
  
  return importantPorts.length;
}

filterImportantPorts();
