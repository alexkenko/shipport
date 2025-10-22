const fs = require('fs');

async function createPortsSQL() {
  try {
    console.log('🚢 Reading global ports JSON file...');
    const portsData = JSON.parse(fs.readFileSync('Listofports/global_ports.json', 'utf8'));
    
    console.log(`📊 Found ${portsData.length} ports to process`);
    
    // Clear existing ports and insert all new ones
    let sql = '-- Clear existing ports and import 3000+ ports\n';
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
    
    // Process ports in batches of 100
    const batchSize = 100;
    const totalBatches = Math.ceil(portsData.length / batchSize);
    
    for (let i = 0; i < totalBatches; i++) {
      const start = i * batchSize;
      const end = Math.min(start + batchSize, portsData.length);
      const batch = portsData.slice(start, end);
      
      console.log(`📦 Processing batch ${i + 1}/${totalBatches} (ports ${start + 1}-${end})...`);
      
      const batchSQL = batch.map((port, index) => {
        const portId = `${i * batchSize + index + 1}`.padStart(6, '0');
        const countryCode = getCountryCode(port.country);
        const regionName = getRegionName(port.continent);
        const worldWaterBody = getWorldWaterBody(port.country, port.continent);
        const ihoSeaArea = getIHOSeaArea(port.country, port.continent);
        const harborSize = getHarborSize(port.name, port.country);
        const tidalRange = getTidalRange(port.country, port.continent);
        const entranceWidth = getEntranceWidth(port.name, port.country);
        const channelDepth = getChannelDepth(port.name, port.country);
        const anchorageDepth = getAnchorageDepth(port.name, port.country);
        const cargoPierDepth = getCargoPierDepth(port.name, port.country);
        const maxVesselLength = getMaxVesselLength(port.name, port.country);
        const maxVesselBeam = getMaxVesselBeam(port.name, port.country);
        const maxVesselDraft = getMaxVesselDraft(port.name, port.country);
        const oilTerminal = getOilTerminal(port.name, port.country);
        const lngTerminal = getLNGTerminal(port.name, port.country);
        const searchText = generateSearchText(port.name, port.country, port.un_locode, regionName);
        
        const cleanName = port.name.replace('Port of ', '').replace('Port ', '');
        
        return `('${countryCode}${portId}', '${regionName}', '${cleanName}', '${port.name}', '${port.un_locode}', '${countryCode}', '${port.country}', '${worldWaterBody}', '${ihoSeaArea}', ${port.latitude}, ${port.longitude}, '${harborSize}', 'Coastal (Natural)', 'Commercial', 'Good', ${tidalRange}, ${entranceWidth}, ${channelDepth}, ${anchorageDepth}, ${cargoPierDepth}, ${maxVesselLength}, ${maxVesselBeam}, ${maxVesselDraft}, true, true, true, true, true, true, ${oilTerminal}, ${lngTerminal}, '${searchText}', NOW(), NOW())`;
      }).join(',\n');
      
      sql += batchSQL;
      if (i < totalBatches - 1) {
        sql += ',\n';
      }
    }
    
    sql += ';\n';
    
    // Write to file
    fs.writeFileSync('sql/import_3000_ports.sql', sql);
    console.log('✅ SQL file created: sql/import_3000_ports.sql');
    console.log(`📊 Total ports processed: ${portsData.length}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Helper functions
function getCountryCode(country) {
  const countryCodes = {
    'United States': 'US',
    'China': 'CN',
    'Singapore': 'SG',
    'Netherlands': 'NL',
    'Germany': 'DE',
    'United Kingdom': 'GB',
    'Japan': 'JP',
    'South Korea': 'KR',
    'France': 'FR',
    'Spain': 'ES',
    'Italy': 'IT',
    'Belgium': 'BE',
    'Canada': 'CA',
    'Australia': 'AU',
    'Brazil': 'BR',
    'India': 'IN',
    'Russia': 'RU',
    'Turkey': 'TR',
    'Greece': 'GR',
    'Poland': 'PL',
    'Sweden': 'SE',
    'Norway': 'NO',
    'Denmark': 'DK',
    'Finland': 'FI',
    'Portugal': 'PT',
    'Ireland': 'IE',
    'Mexico': 'MX',
    'South Africa': 'ZA',
    'Egypt': 'EG',
    'Thailand': 'TH',
    'Vietnam': 'VN',
    'Philippines': 'PH',
    'Malaysia': 'MY',
    'Indonesia': 'ID',
    'Argentina': 'AR',
    'Chile': 'CL',
    'Colombia': 'CO',
    'Panama': 'PA',
    'Morocco': 'MA',
    'Saudi Arabia': 'SA',
    'United Arab Emirates': 'AE',
    'Oman': 'OM',
    'Israel': 'IL',
    'Taiwan': 'TW',
    'New Zealand': 'NZ'
  };
  return countryCodes[country] || 'XX';
}

function getRegionName(continent) {
  const regions = {
    'Asia': 'East Asia',
    'Europe': 'Western Europe',
    'North America': 'North America',
    'South America': 'South America',
    'Africa': 'Africa',
    'Oceania': 'Oceania'
  };
  return regions[continent] || 'Unknown';
}

function getWorldWaterBody(country, continent) {
  if (continent === 'Asia') return 'Pacific Ocean';
  if (continent === 'Europe') return 'Atlantic Ocean';
  if (continent === 'North America') return 'Pacific Ocean';
  if (continent === 'South America') return 'Atlantic Ocean';
  if (continent === 'Africa') return 'Indian Ocean';
  if (continent === 'Oceania') return 'Pacific Ocean';
  return 'Unknown';
}

function getIHOSeaArea(country, continent) {
  if (country === 'China' || country === 'Japan' || country === 'South Korea') return 'East China Sea';
  if (country === 'Singapore' || country === 'Malaysia' || country === 'Indonesia') return 'Singapore Strait';
  if (country === 'United States') return 'North Pacific';
  if (country === 'Netherlands' || country === 'Germany' || country === 'United Kingdom') return 'North Sea';
  if (country === 'France' || country === 'Spain' || country === 'Italy') return 'Mediterranean Sea';
  return 'Unknown';
}

function getHarborSize(portName, country) {
  const majorPorts = ['Shanghai', 'Singapore', 'Rotterdam', 'Los Angeles', 'Hamburg', 'Ningbo', 'Shenzhen', 'Guangzhou', 'Busan', 'Hong Kong'];
  const isMajor = majorPorts.some(major => portName.includes(major));
  return isMajor ? 'Large' : 'Medium';
}

function getTidalRange(country, continent) {
  if (country === 'United Kingdom' || country === 'France') return 4.0;
  if (country === 'China' || country === 'South Korea') return 3.0;
  if (country === 'United States') return 2.0;
  if (continent === 'Europe') return 1.0;
  return 2.0;
}

function getEntranceWidth(portName, country) {
  const majorPorts = ['Shanghai', 'Singapore', 'Rotterdam', 'Los Angeles', 'Hamburg'];
  const isMajor = majorPorts.some(major => portName.includes(major));
  return isMajor ? 400 : 300;
}

function getChannelDepth(portName, country) {
  const majorPorts = ['Shanghai', 'Singapore', 'Rotterdam', 'Los Angeles', 'Hamburg'];
  const isMajor = majorPorts.some(major => portName.includes(major));
  return isMajor ? 16 : 14;
}

function getAnchorageDepth(portName, country) {
  const majorPorts = ['Shanghai', 'Singapore', 'Rotterdam', 'Los Angeles', 'Hamburg'];
  const isMajor = majorPorts.some(major => portName.includes(major));
  return isMajor ? 18 : 16;
}

function getCargoPierDepth(portName, country) {
  const majorPorts = ['Shanghai', 'Singapore', 'Rotterdam', 'Los Angeles', 'Hamburg'];
  const isMajor = majorPorts.some(major => portName.includes(major));
  return isMajor ? 16 : 14;
}

function getMaxVesselLength(portName, country) {
  const majorPorts = ['Shanghai', 'Singapore', 'Rotterdam', 'Los Angeles', 'Hamburg'];
  const isMajor = majorPorts.some(major => portName.includes(major));
  return isMajor ? 400 : 350;
}

function getMaxVesselBeam(portName, country) {
  const majorPorts = ['Shanghai', 'Singapore', 'Rotterdam', 'Los Angeles', 'Hamburg'];
  const isMajor = majorPorts.some(major => portName.includes(major));
  return isMajor ? 60 : 55;
}

function getMaxVesselDraft(portName, country) {
  const majorPorts = ['Shanghai', 'Singapore', 'Rotterdam', 'Los Angeles', 'Hamburg'];
  const isMajor = majorPorts.some(major => portName.includes(major));
  return isMajor ? 16 : 14;
}

function getOilTerminal(portName, country) {
  const oilPorts = ['Houston', 'Rotterdam', 'Singapore', 'Dubai', 'Jeddah'];
  return oilPorts.some(port => portName.includes(port));
}

function getLNGTerminal(portName, country) {
  const lngPorts = ['Singapore', 'Rotterdam', 'Los Angeles'];
  return lngPorts.some(port => portName.includes(port));
}

function generateSearchText(portName, country, unLocode, regionName) {
  const cleanName = portName.replace('Port of ', '').replace('Port ', '');
  return `${cleanName} port ${country.toLowerCase()} ${unLocode.toLowerCase()} ${regionName.toLowerCase()} container cargo shipping maritime`.toLowerCase();
}

createPortsSQL();
