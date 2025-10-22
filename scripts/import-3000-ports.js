const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function importAllPorts() {
  try {
    console.log('🚢 Reading global ports JSON file...');
    const portsData = JSON.parse(fs.readFileSync('Listofports/global_ports.json', 'utf8'));
    
    console.log(`📊 Found ${portsData.length} ports to import`);
    
    // Clear existing ports first
    console.log('🗑️ Clearing existing ports...');
    await supabase.from('ports').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    
    console.log('✅ Cleared existing ports');
    
    // Process ports in batches of 100
    const batchSize = 100;
    const totalBatches = Math.ceil(portsData.length / batchSize);
    
    console.log(`📦 Processing ${totalBatches} batches of ${batchSize} ports each...`);
    
    for (let i = 0; i < totalBatches; i++) {
      const start = i * batchSize;
      const end = Math.min(start + batchSize, portsData.length);
      const batch = portsData.slice(start, end);
      
      console.log(`📥 Processing batch ${i + 1}/${totalBatches} (ports ${start + 1}-${end})...`);
      
      // Transform ports to match our schema
      const transformedPorts = batch.map((port, index) => {
        const portId = `${i * batchSize + index + 1}`.padStart(6, '0');
        const countryCode = getCountryCode(port.country);
        const regionName = getRegionName(port.continent);
        const worldWaterBody = getWorldWaterBody(port.country, port.continent);
        const ihoSeaArea = getIHOSeaArea(port.country, port.continent);
        
        return {
          world_port_index: `${countryCode}${portId}`,
          region_name: regionName,
          main_port_name: port.name.replace('Port of ', '').replace('Port ', ''),
          alternate_port_name: port.name,
          un_locode: port.un_locode,
          country_code: countryCode,
          country_name: port.country,
          world_water_body: worldWaterBody,
          iho_sea_area: ihoSeaArea,
          latitude: port.latitude,
          longitude: port.longitude,
          harbor_size: getHarborSize(port.name, port.country),
          harbor_type: 'Coastal (Natural)',
          harbor_use: 'Commercial',
          shelter_afforded: 'Good',
          tidal_range: getTidalRange(port.country, port.continent),
          entrance_width: getEntranceWidth(port.name, port.country),
          channel_depth: getChannelDepth(port.name, port.country),
          anchorage_depth: getAnchorageDepth(port.name, port.country),
          cargo_pier_depth: getCargoPierDepth(port.name, port.country),
          max_vessel_length: getMaxVesselLength(port.name, port.country),
          max_vessel_beam: getMaxVesselBeam(port.name, port.country),
          max_vessel_draft: getMaxVesselDraft(port.name, port.country),
          pilotage_compulsory: true,
          pilotage_available: true,
          tugs_assistance: true,
          facilities_wharves: true,
          facilities_anchorage: true,
          facilities_container: true,
          facilities_oil_terminal: getOilTerminal(port.name, port.country),
          facilities_lng_terminal: getLNGTerminal(port.name, port.country),
          search_text: generateSearchText(port.name, port.country, port.un_locode, regionName),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
      });
      
      // Insert batch
      const { error } = await supabase
        .from('ports')
        .insert(transformedPorts);
      
      if (error) {
        console.error(`❌ Error in batch ${i + 1}:`, error);
        continue;
      }
      
      console.log(`✅ Batch ${i + 1}/${totalBatches} completed`);
    }
    
    // Final count
    const { count } = await supabase
      .from('ports')
      .select('*', { count: 'exact', head: true });
    
    console.log(`🎉 Import completed! Total ports in database: ${count}`);
    
  } catch (error) {
    console.error('❌ Fatal error:', error);
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

importAllPorts();
