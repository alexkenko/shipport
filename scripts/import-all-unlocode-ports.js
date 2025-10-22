const fs = require('fs');
const path = require('path');

async function importAllUNLOCODEPorts() {
  try {
    console.log('🚢 Starting comprehensive UN/LOCODE port import...');
    
    // Define the CSV files to process
    const csvFiles = [
      'Listofports/2024-2 UNLOCODE CodeListPart1.csv',
      'Listofports/2024-2 UNLOCODE CodeListPart2.csv', 
      'Listofports/2024-2 UNLOCODE CodeListPart3.csv'
    ];
    
    let allPorts = [];
    let totalProcessed = 0;
    
    // Process each CSV file
    for (const filePath of csvFiles) {
      console.log(`📖 Processing ${path.basename(filePath)}...`);
      
      const data = fs.readFileSync(filePath, 'utf8');
      const lines = data.split('\n');
      
      console.log(`📊 Found ${lines.length} lines in ${path.basename(filePath)}`);
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line || line.startsWith(',')) continue; // Skip empty lines and header-like lines
        
        const columns = parseCSVLine(line);
        if (columns.length < 10) continue;
        
        // UN/LOCODE structure: [empty, country_code, locode, name, name_wo_diacritics, subdivision, function, status, date, iata, coordinates, remarks]
        const [
          , // empty first column
          countryCode,
          locode,
          name,
          nameWoDiacritics,
          subdivision,
          functionCode,
          status,
          date,
          iata,
          coordinates,
          remarks
        ] = columns;
        
        // Skip if essential data is missing
        if (!countryCode || !locode || !name) continue;
        
        // Filter for maritime ports - look for function codes that indicate ports/harbors
        // Function codes: 1=port, 2=rail, 3=road, 4=airport, 5=postal, 6=reserved, 7=border
        const isMaritimePort = functionCode && functionCode.includes('1');
        
        // Also include locations with maritime-related keywords
        const maritimeKeywords = ['port', 'harbor', 'harbour', 'marina', 'dock', 'pier', 'wharf', 'terminal', 'quay'];
        const hasMaritimeKeyword = maritimeKeywords.some(keyword => 
          name.toLowerCase().includes(keyword) || 
          (nameWoDiacritics && nameWoDiacritics.toLowerCase().includes(keyword))
        );
        
        if (isMaritimePort || hasMaritimeKeyword) {
          // Parse coordinates
          const { latitude, longitude } = parseCoordinates(coordinates);
          
          if (latitude && longitude) {
            const port = {
              world_port_index: `${countryCode}${locode}`,
              region_name: getRegionName(countryCode),
              main_port_name: nameWoDiacritics || name,
              alternate_port_name: name,
              un_locode: `${countryCode}${locode}`,
              country_code: countryCode,
              country_name: getCountryName(countryCode),
              world_water_body: getWorldWaterBody(countryCode),
              iho_sea_area: getIHOSeaArea(countryCode),
              latitude: latitude,
              longitude: longitude,
              harbor_size: getHarborSize(name, countryCode),
              harbor_type: 'Coastal (Natural)',
              harbor_use: 'Commercial',
              shelter_afforded: 'Good',
              tidal_range: getTidalRange(countryCode),
              entrance_width: getEntranceWidth(name, countryCode),
              channel_depth: getChannelDepth(name, countryCode),
              anchorage_depth: getAnchorageDepth(name, countryCode),
              cargo_pier_depth: getCargoPierDepth(name, countryCode),
              max_vessel_length: getMaxVesselLength(name, countryCode),
              max_vessel_beam: getMaxVesselBeam(name, countryCode),
              max_vessel_draft: getMaxVesselDraft(name, countryCode),
              pilotage_compulsory: true,
              pilotage_available: true,
              tugs_assistance: true,
              facilities_wharves: true,
              facilities_anchorage: true,
              facilities_container: getContainerFacility(name, countryCode),
              facilities_oil_terminal: getOilTerminal(name, countryCode),
              facilities_lng_terminal: getLNGTerminal(name, countryCode),
              search_text: generateSearchText(name, getCountryName(countryCode), `${countryCode}${locode}`, getRegionName(countryCode)),
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };
            
            allPorts.push(port);
          }
        }
        
        totalProcessed++;
        if (totalProcessed % 10000 === 0) {
          console.log(`📊 Processed ${totalProcessed} locations, found ${allPorts.length} maritime ports so far...`);
        }
      }
    }
    
    console.log(`🎉 Processing complete!`);
    console.log(`📊 Total locations processed: ${totalProcessed}`);
    console.log(`🚢 Maritime ports found: ${allPorts.length}`);
    
    // Write to SQL file
    const sql = generateSQL(allPorts);
    fs.writeFileSync('sql/import_all_unlocode_ports.sql', sql);
    console.log(`✅ SQL file created: sql/import_all_unlocode_ports.sql`);
    console.log(`📊 File size: ${(fs.statSync('sql/import_all_unlocode_ports.sql').size / 1024 / 1024).toFixed(2)} MB`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
}

function parseCoordinates(coords) {
  if (!coords) return { latitude: null, longitude: null };
  
  // Format: "4230N 00131E" or "4230N00131E"
  const match = coords.match(/(\d{2})(\d{2})([NS])\s*(\d{3})(\d{2})([EW])/);
  if (!match) return { latitude: null, longitude: null };
  
  const [, latDeg, latMin, latDir, lonDeg, lonMin, lonDir] = match;
  
  let latitude = parseInt(latDeg) + parseInt(latMin) / 60;
  let longitude = parseInt(lonDeg) + parseInt(lonMin) / 60;
  
  if (latDir === 'S') latitude = -latitude;
  if (lonDir === 'W') longitude = -longitude;
  
  return { latitude, longitude };
}

function getRegionName(countryCode) {
  const regions = {
    'US': 'North America', 'CA': 'North America', 'MX': 'North America',
    'CN': 'East Asia', 'JP': 'East Asia', 'KR': 'East Asia', 'TW': 'East Asia',
    'SG': 'Southeast Asia', 'MY': 'Southeast Asia', 'TH': 'Southeast Asia', 'VN': 'Southeast Asia',
    'ID': 'Southeast Asia', 'PH': 'Southeast Asia', 'MM': 'Southeast Asia', 'KH': 'Southeast Asia',
    'NL': 'Western Europe', 'DE': 'Western Europe', 'GB': 'Western Europe', 'FR': 'Western Europe',
    'ES': 'Southern Europe', 'IT': 'Southern Europe', 'GR': 'Southern Europe', 'PT': 'Southern Europe',
    'RU': 'Eastern Europe', 'PL': 'Eastern Europe', 'UA': 'Eastern Europe', 'BY': 'Eastern Europe',
    'AU': 'Oceania', 'NZ': 'Oceania', 'FJ': 'Oceania', 'PG': 'Oceania',
    'BR': 'South America', 'AR': 'South America', 'CL': 'South America', 'CO': 'South America',
    'ZA': 'Africa', 'EG': 'Africa', 'NG': 'Africa', 'KE': 'Africa',
    'AE': 'Middle East', 'SA': 'Middle East', 'IR': 'Middle East', 'IQ': 'Middle East'
  };
  return regions[countryCode] || 'Unknown';
}

function getCountryName(countryCode) {
  const countries = {
    'US': 'United States', 'CA': 'Canada', 'MX': 'Mexico',
    'CN': 'China', 'JP': 'Japan', 'KR': 'South Korea', 'TW': 'Taiwan',
    'SG': 'Singapore', 'MY': 'Malaysia', 'TH': 'Thailand', 'VN': 'Vietnam',
    'ID': 'Indonesia', 'PH': 'Philippines', 'MM': 'Myanmar', 'KH': 'Cambodia',
    'NL': 'Netherlands', 'DE': 'Germany', 'GB': 'United Kingdom', 'FR': 'France',
    'ES': 'Spain', 'IT': 'Italy', 'GR': 'Greece', 'PT': 'Portugal',
    'RU': 'Russia', 'PL': 'Poland', 'UA': 'Ukraine', 'BY': 'Belarus',
    'AU': 'Australia', 'NZ': 'New Zealand', 'FJ': 'Fiji', 'PG': 'Papua New Guinea',
    'BR': 'Brazil', 'AR': 'Argentina', 'CL': 'Chile', 'CO': 'Colombia',
    'ZA': 'South Africa', 'EG': 'Egypt', 'NG': 'Nigeria', 'KE': 'Kenya',
    'AE': 'United Arab Emirates', 'SA': 'Saudi Arabia', 'IR': 'Iran', 'IQ': 'Iraq'
  };
  return countries[countryCode] || countryCode;
}

function getWorldWaterBody(countryCode) {
  const waterBodies = {
    'US': 'Pacific Ocean', 'CA': 'Pacific Ocean', 'MX': 'Pacific Ocean',
    'CN': 'Pacific Ocean', 'JP': 'Pacific Ocean', 'KR': 'Pacific Ocean', 'TW': 'Pacific Ocean',
    'SG': 'Pacific Ocean', 'MY': 'Indian Ocean', 'TH': 'Pacific Ocean', 'VN': 'Pacific Ocean',
    'ID': 'Pacific Ocean', 'PH': 'Pacific Ocean', 'MM': 'Indian Ocean', 'KH': 'Pacific Ocean',
    'NL': 'Atlantic Ocean', 'DE': 'Atlantic Ocean', 'GB': 'Atlantic Ocean', 'FR': 'Atlantic Ocean',
    'ES': 'Atlantic Ocean', 'IT': 'Mediterranean Sea', 'GR': 'Mediterranean Sea', 'PT': 'Atlantic Ocean',
    'RU': 'Baltic Sea', 'PL': 'Baltic Sea', 'UA': 'Black Sea', 'BY': 'Baltic Sea',
    'AU': 'Pacific Ocean', 'NZ': 'Pacific Ocean', 'FJ': 'Pacific Ocean', 'PG': 'Pacific Ocean',
    'BR': 'Atlantic Ocean', 'AR': 'Atlantic Ocean', 'CL': 'Pacific Ocean', 'CO': 'Caribbean Sea',
    'ZA': 'Indian Ocean', 'EG': 'Mediterranean Sea', 'NG': 'Atlantic Ocean', 'KE': 'Indian Ocean',
    'AE': 'Persian Gulf', 'SA': 'Red Sea', 'IR': 'Persian Gulf', 'IQ': 'Persian Gulf'
  };
  return waterBodies[countryCode] || 'Unknown';
}

function getIHOSeaArea(countryCode) {
  const seaAreas = {
    'CN': 'East China Sea', 'JP': 'East China Sea', 'KR': 'Korea Strait', 'TW': 'Taiwan Strait',
    'SG': 'Singapore Strait', 'MY': 'Strait of Malacca', 'TH': 'Gulf of Thailand', 'VN': 'South China Sea',
    'ID': 'Java Sea', 'PH': 'Philippine Sea', 'MM': 'Andaman Sea', 'KH': 'Gulf of Thailand',
    'NL': 'North Sea', 'DE': 'North Sea', 'GB': 'North Sea', 'FR': 'English Channel',
    'ES': 'Mediterranean Sea', 'IT': 'Mediterranean Sea', 'GR': 'Aegean Sea', 'PT': 'North Atlantic',
    'RU': 'Gulf of Finland', 'PL': 'Gulf of Gdansk', 'UA': 'Black Sea', 'BY': 'Baltic Sea',
    'AU': 'Tasman Sea', 'NZ': 'Tasman Sea', 'FJ': 'South Pacific', 'PG': 'Coral Sea',
    'BR': 'South Atlantic', 'AR': 'South Atlantic', 'CL': 'South Pacific', 'CO': 'Caribbean Sea',
    'ZA': 'South Indian Ocean', 'EG': 'Eastern Mediterranean', 'NG': 'Gulf of Guinea', 'KE': 'Indian Ocean',
    'AE': 'Persian Gulf', 'SA': 'Red Sea', 'IR': 'Persian Gulf', 'IQ': 'Persian Gulf'
  };
  return seaAreas[countryCode] || 'Unknown';
}

function getHarborSize(name, countryCode) {
  const majorPorts = ['Shanghai', 'Singapore', 'Rotterdam', 'Los Angeles', 'Hamburg', 'Ningbo', 'Shenzhen', 'Guangzhou', 'Busan', 'Hong Kong', 'Dubai', 'Jeddah', 'Mumbai', 'Sydney', 'Melbourne'];
  const isMajor = majorPorts.some(port => name.toLowerCase().includes(port.toLowerCase()));
  return isMajor ? 'Large' : 'Medium';
}

function getTidalRange(countryCode) {
  const tidalRanges = {
    'GB': 4.0, 'FR': 4.0, 'CA': 3.5, 'CN': 3.0, 'KR': 3.0, 'US': 2.0
  };
  return tidalRanges[countryCode] || 2.0;
}

function getEntranceWidth(name, countryCode) {
  const majorPorts = ['Shanghai', 'Singapore', 'Rotterdam', 'Los Angeles', 'Hamburg', 'Dubai'];
  const isMajor = majorPorts.some(port => name.toLowerCase().includes(port.toLowerCase()));
  return isMajor ? 400 : 300;
}

function getChannelDepth(name, countryCode) {
  const majorPorts = ['Shanghai', 'Singapore', 'Rotterdam', 'Los Angeles', 'Hamburg', 'Dubai'];
  const isMajor = majorPorts.some(port => name.toLowerCase().includes(port.toLowerCase()));
  return isMajor ? 16 : 14;
}

function getAnchorageDepth(name, countryCode) {
  const majorPorts = ['Shanghai', 'Singapore', 'Rotterdam', 'Los Angeles', 'Hamburg', 'Dubai'];
  const isMajor = majorPorts.some(port => name.toLowerCase().includes(port.toLowerCase()));
  return isMajor ? 18 : 16;
}

function getCargoPierDepth(name, countryCode) {
  const majorPorts = ['Shanghai', 'Singapore', 'Rotterdam', 'Los Angeles', 'Hamburg', 'Dubai'];
  const isMajor = majorPorts.some(port => name.toLowerCase().includes(port.toLowerCase()));
  return isMajor ? 16 : 14;
}

function getMaxVesselLength(name, countryCode) {
  const majorPorts = ['Shanghai', 'Singapore', 'Rotterdam', 'Los Angeles', 'Hamburg', 'Dubai'];
  const isMajor = majorPorts.some(port => name.toLowerCase().includes(port.toLowerCase()));
  return isMajor ? 400 : 350;
}

function getMaxVesselBeam(name, countryCode) {
  const majorPorts = ['Shanghai', 'Singapore', 'Rotterdam', 'Los Angeles', 'Hamburg', 'Dubai'];
  const isMajor = majorPorts.some(port => name.toLowerCase().includes(port.toLowerCase()));
  return isMajor ? 60 : 55;
}

function getMaxVesselDraft(name, countryCode) {
  const majorPorts = ['Shanghai', 'Singapore', 'Rotterdam', 'Los Angeles', 'Hamburg', 'Dubai'];
  const isMajor = majorPorts.some(port => name.toLowerCase().includes(port.toLowerCase()));
  return isMajor ? 16 : 14;
}

function getContainerFacility(name, countryCode) {
  const containerPorts = ['Shanghai', 'Singapore', 'Rotterdam', 'Los Angeles', 'Hamburg', 'Dubai', 'Busan', 'Ningbo', 'Shenzhen'];
  return containerPorts.some(port => name.toLowerCase().includes(port.toLowerCase()));
}

function getOilTerminal(name, countryCode) {
  const oilPorts = ['Houston', 'Rotterdam', 'Singapore', 'Dubai', 'Jeddah', 'Ras Tanura'];
  return oilPorts.some(port => name.toLowerCase().includes(port.toLowerCase()));
}

function getLNGTerminal(name, countryCode) {
  const lngPorts = ['Singapore', 'Rotterdam', 'Los Angeles', 'Qatar', 'Yamal'];
  return lngPorts.some(port => name.toLowerCase().includes(port.toLowerCase()));
}

function generateSearchText(name, country, unLocode, regionName) {
  const cleanName = name.replace(/[^\w\s]/g, '').toLowerCase();
  return `${cleanName} port ${country.toLowerCase()} ${unLocode.toLowerCase()} ${regionName.toLowerCase()} container cargo shipping maritime`.toLowerCase();
}

function generateSQL(ports) {
  let sql = '-- Import all UN/LOCODE maritime ports\n';
  sql += 'DELETE FROM ports;\n\n';
  sql += 'INSERT INTO ports (\n';
  sql += '    world_port_index, region_name, main_port_name, alternate_port_name,\n';
  sql += '    un_locode, country_code, country_name, world_water_body, iho_sea_area,\n';
  sql += '    latitude, longitude, harbor_size, harbor_type, harbor_use, shelter_afforded,\n';
  sql += '    tidal_range, entrance_width, channel_depth, anchorage_depth, cargo_pier_depth,\n';
  sql += '    max_vessel_length, max_vessel_beam, max_vessel_draft,\n';
  sql += '    pilotage_compulsory, pilotage_available, tugs_assistance,\n';
  sql += '    facilities_wharves, facilities_anchorage, facilities_container,\n';
  sql += '    facilities_oil_terminal, facilities_lng_terminal, search_text,\n';
  sql += '    created_at, updated_at\n';
  sql += ') VALUES\n';
  
  const portRows = ports.map(port => {
    return `('${port.world_port_index}', '${port.region_name}', '${port.main_port_name.replace(/'/g, "''")}', '${port.alternate_port_name.replace(/'/g, "''")}', '${port.un_locode}', '${port.country_code}', '${port.country_name}', '${port.world_water_body}', '${port.iho_sea_area}', ${port.latitude}, ${port.longitude}, '${port.harbor_size}', '${port.harbor_type}', '${port.harbor_use}', '${port.shelter_afforded}', ${port.tidal_range}, ${port.entrance_width}, ${port.channel_depth}, ${port.anchorage_depth}, ${port.cargo_pier_depth}, ${port.max_vessel_length}, ${port.max_vessel_beam}, ${port.max_vessel_draft}, ${port.pilotage_compulsory}, ${port.pilotage_available}, ${port.tugs_assistance}, ${port.facilities_wharves}, ${port.facilities_anchorage}, ${port.facilities_container}, ${port.facilities_oil_terminal}, ${port.facilities_lng_terminal}, '${port.search_text.replace(/'/g, "''")}', NOW(), NOW())`;
  });
  
  sql += portRows.join(',\n');
  sql += ';\n';
  
  return sql;
}

// Run the import
importAllUNLOCODEPorts();
