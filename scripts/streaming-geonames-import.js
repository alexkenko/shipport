const fs = require('fs');
const https = require('https');
const readline = require('readline');

// GeoNames allCountries file
const GEONAMES_URL = 'https://download.geonames.org/export/dump/allCountries.zip';
const GEONAMES_FILE = 'temp/allCountries.txt';

// Create temp directory if it doesn't exist
if (!fs.existsSync('temp')) {
  fs.mkdirSync('temp');
}

// Download GeoNames data
async function downloadGeoNamesData() {
  return new Promise((resolve, reject) => {
    console.log('🌍 Downloading allCountries from GeoNames...');
    
    const file = fs.createWriteStream('temp/allCountries.zip');
    
    https.get(GEONAMES_URL, (response) => {
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log('📦 allCountries downloaded');
        resolve();
      });
    }).on('error', (err) => {
      console.error('❌ Error downloading allCountries:', err);
      reject(err);
    });
  });
}

// Extract zip file
async function extractZip() {
  return new Promise((resolve, reject) => {
    const zip = require('node-stream-zip');
    const zipFile = new zip({ file: 'temp/allCountries.zip' });
    
    zipFile.on('ready', () => {
      zipFile.extract('allCountries.txt', 'temp/', (err) => {
        if (err) {
          console.error('❌ Error extracting allCountries:', err);
          reject(err);
          return;
        }
        
        console.log('✅ allCountries extracted');
        zipFile.close();
        resolve();
      });
    });
  });
}

// Process GeoNames data using streaming
async function processGeoNamesDataStreaming() {
  console.log('🔄 Processing allCountries for ports and harbors (streaming)...');
  
  const fileStream = fs.createReadStream(GEONAMES_FILE);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  
  const ports = [];
  const portKeywords = [
    'port', 'harbor', 'harbour', 'marina', 'dock', 'wharf', 'pier', 'terminal',
    'seaport', 'porto', 'puerto', 'havn', 'hamn', 'satama', 'liman',
    'limani', 'luka', 'pristan', 'pristanishche', 'bandom', 'bandar', 'pelabuhan'
  ];
  
  let processedCount = 0;
  let portCount = 0;
  
  for await (const line of rl) {
    if (line.trim()) {
      const fields = line.split('\t');
      
      if (fields.length >= 19) {
        const [
          geonameid,        // 0
          name,             // 1
          asciiname,        // 2
          alternatenames,   // 3
          latitude,         // 4
          longitude,        // 5
          feature_class,    // 6
          feature_code,     // 7
          country_code,     // 8
          cc2,              // 9
          admin1_code,      // 10
          admin2_code,      // 11
          admin3_code,      // 12
          admin4_code,      // 13
          population,       // 14
          elevation,        // 15
          dem,              // 16
          timezone,         // 17
          modification_date // 18
        ] = fields;
        
        processedCount++;
        
        // Check if this is a port/harbor related location
        const isPort = portKeywords.some(keyword => 
          name.toLowerCase().includes(keyword) ||
          asciiname.toLowerCase().includes(keyword) ||
          (alternatenames && alternatenames.toLowerCase().includes(keyword))
        );
        
        // Check feature codes for ports and harbors
        const isPortFeature = feature_code === 'HBR' || // Harbor
                              feature_code === 'PRT' || // Port
                              feature_code === 'MAR' || // Marina
                              feature_code === 'DOCK' || // Dock
                              feature_code === 'WHF' || // Wharf
                              feature_code === 'PIE' || // Pier
                              feature_code === 'TRM';   // Terminal
        
        if (isPort || isPortFeature) {
          // Get country name from country code
          const countryName = getCountryName(country_code);
          
          // Generate search text
          const searchText = [
            name,
            asciiname,
            countryName,
            country_code,
            alternatenames
          ].filter(Boolean).join(' ').toLowerCase().trim();
          
          // Determine harbor size based on population and name
          let harborSize = 'Small';
          const pop = parseInt(population) || 0;
          const nameLower = name.toLowerCase();
          
          if (pop > 100000 || 
              nameLower.includes('major') ||
              nameLower.includes('international') ||
              nameLower.includes('main') ||
              nameLower.includes('central')) {
            harborSize = 'Large';
          } else if (pop > 10000 || 
                     nameLower.includes('port of') ||
                     nameLower.includes('harbor') ||
                     nameLower.includes('harbour') ||
                     nameLower.includes('terminal')) {
            harborSize = 'Medium';
          }
          
          // Determine harbor type
          let harborType = 'Coastal (Natural)';
          if (nameLower.includes('marina') || nameLower.includes('yacht')) {
            harborType = 'Coastal (Natural)';
          } else if (nameLower.includes('terminal') || nameLower.includes('dock')) {
            harborType = 'Coastal (Artificial)';
          } else if (nameLower.includes('river') || nameLower.includes('inland')) {
            harborType = 'River (Natural)';
          }
          
          ports.push({
            world_port_index: geonameid,
            region_name: null,
            main_port_name: name,
            alternate_port_name: asciiname !== name ? asciiname : null,
            un_locode: null,
            country_code: country_code,
            country_name: countryName,
            world_water_body: null,
            iho_sea_area: null,
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            harbor_size: harborSize,
            harbor_type: harborType,
            harbor_use: 'Commercial',
            shelter_afforded: 'Good',
            tidal_range: null,
            entrance_width: null,
            channel_depth: null,
            anchorage_depth: null,
            cargo_pier_depth: null,
            max_vessel_length: null,
            max_vessel_beam: null,
            max_vessel_draft: null,
            pilotage_compulsory: harborSize === 'Large',
            pilotage_available: true,
            tugs_assistance: harborSize === 'Large' || harborSize === 'Medium',
            facilities_wharves: true,
            facilities_anchorage: true,
            facilities_container: harborSize === 'Large',
            facilities_oil_terminal: false,
            facilities_lng_terminal: false,
            search_text: searchText
          });
          
          portCount++;
          
          // Log progress every 1000 ports
          if (portCount % 1000 === 0) {
            console.log(`📊 Found ${portCount} ports so far...`);
          }
        }
      }
    }
  }
  
  console.log(`📊 Processed ${processedCount} locations, found ${portCount} ports and harbors`);
  return ports;
}

// Country code to name mapping
function getCountryName(countryCode) {
  const countryMap = {
    'US': 'United States', 'GB': 'United Kingdom', 'DE': 'Germany', 'NL': 'Netherlands',
    'BE': 'Belgium', 'FR': 'France', 'ES': 'Spain', 'IT': 'Italy', 'GR': 'Greece',
    'TR': 'Turkey', 'RU': 'Russia', 'CN': 'China', 'JP': 'Japan', 'KR': 'South Korea',
    'SG': 'Singapore', 'HK': 'Hong Kong', 'TW': 'Taiwan', 'TH': 'Thailand',
    'MY': 'Malaysia', 'ID': 'Indonesia', 'PH': 'Philippines', 'VN': 'Vietnam',
    'IN': 'India', 'BD': 'Bangladesh', 'PK': 'Pakistan', 'AE': 'United Arab Emirates',
    'SA': 'Saudi Arabia', 'EG': 'Egypt', 'ZA': 'South Africa', 'BR': 'Brazil',
    'AR': 'Argentina', 'CL': 'Chile', 'PE': 'Peru', 'CO': 'Colombia', 'VE': 'Venezuela',
    'MX': 'Mexico', 'CA': 'Canada', 'AU': 'Australia', 'NZ': 'New Zealand',
    'NO': 'Norway', 'SE': 'Sweden', 'DK': 'Denmark', 'FI': 'Finland', 'PL': 'Poland',
    'CZ': 'Czech Republic', 'HU': 'Hungary', 'RO': 'Romania', 'BG': 'Bulgaria',
    'HR': 'Croatia', 'SI': 'Slovenia', 'SK': 'Slovakia', 'LT': 'Lithuania',
    'LV': 'Latvia', 'EE': 'Estonia', 'IE': 'Ireland', 'PT': 'Portugal', 'MT': 'Malta',
    'CY': 'Cyprus', 'IS': 'Iceland', 'LU': 'Luxembourg', 'AT': 'Austria',
    'CH': 'Switzerland', 'LI': 'Liechtenstein', 'MC': 'Monaco', 'SM': 'San Marino',
    'VA': 'Vatican City', 'AD': 'Andorra', 'GI': 'Gibraltar', 'MG': 'Madagascar',
    'TZ': 'Tanzania', 'KE': 'Kenya', 'NG': 'Nigeria', 'GH': 'Ghana', 'MA': 'Morocco',
    'TN': 'Tunisia', 'LY': 'Libya', 'DZ': 'Algeria', 'SD': 'Sudan', 'ET': 'Ethiopia',
    'UG': 'Uganda', 'RW': 'Rwanda', 'BI': 'Burundi', 'DJ': 'Djibouti', 'SO': 'Somalia',
    'ER': 'Eritrea', 'SS': 'South Sudan', 'CF': 'Central African Republic', 'TD': 'Chad',
    'NE': 'Niger', 'ML': 'Mali', 'BF': 'Burkina Faso', 'SN': 'Senegal', 'GM': 'Gambia',
    'GW': 'Guinea-Bissau', 'GN': 'Guinea', 'SL': 'Sierra Leone', 'LR': 'Liberia',
    'CI': 'Ivory Coast', 'TG': 'Togo', 'BJ': 'Benin', 'CM': 'Cameroon',
    'GQ': 'Equatorial Guinea', 'GA': 'Gabon', 'CG': 'Republic of the Congo',
    'CD': 'Democratic Republic of the Congo', 'AO': 'Angola', 'ZM': 'Zambia',
    'ZW': 'Zimbabwe', 'BW': 'Botswana', 'NA': 'Namibia', 'SZ': 'Eswatini',
    'LS': 'Lesotho', 'MW': 'Malawi', 'MZ': 'Mozambique', 'MU': 'Mauritius',
    'SC': 'Seychelles', 'KM': 'Comoros', 'YT': 'Mayotte', 'RE': 'Réunion',
    'SH': 'Saint Helena, Ascension, and Tristan da Cunha', 'CV': 'Cape Verde',
    'ST': 'São Tomé and Príncipe', 'IL': 'Israel', 'JO': 'Jordan', 'LB': 'Lebanon',
    'SY': 'Syria', 'IQ': 'Iraq', 'IR': 'Iran', 'AF': 'Afghanistan', 'LK': 'Sri Lanka',
    'MV': 'Maldives', 'BT': 'Bhutan', 'NP': 'Nepal', 'MM': 'Myanmar', 'LA': 'Laos',
    'KH': 'Cambodia', 'BN': 'Brunei', 'TL': 'East Timor', 'FJ': 'Fiji',
    'PG': 'Papua New Guinea', 'SB': 'Solomon Islands', 'VU': 'Vanuatu',
    'NC': 'New Caledonia', 'PF': 'French Polynesia', 'WS': 'Samoa', 'TO': 'Tonga',
    'KI': 'Kiribati', 'TV': 'Tuvalu', 'NR': 'Nauru', 'PW': 'Palau', 'FM': 'Micronesia',
    'MH': 'Marshall Islands', 'AS': 'American Samoa', 'GU': 'Guam',
    'MP': 'Northern Mariana Islands', 'VI': 'U.S. Virgin Islands', 'PR': 'Puerto Rico',
    'DO': 'Dominican Republic', 'HT': 'Haiti', 'CU': 'Cuba', 'JM': 'Jamaica',
    'BS': 'Bahamas', 'BB': 'Barbados', 'TT': 'Trinidad and Tobago', 'GD': 'Grenada',
    'LC': 'Saint Lucia', 'VC': 'Saint Vincent and the Grenadines',
    'AG': 'Antigua and Barbuda', 'KN': 'Saint Kitts and Nevis', 'DM': 'Dominica',
    'BZ': 'Belize', 'GT': 'Guatemala', 'HN': 'Honduras', 'SV': 'El Salvador',
    'NI': 'Nicaragua', 'CR': 'Costa Rica', 'PA': 'Panama', 'GY': 'Guyana',
    'SR': 'Suriname', 'UY': 'Uruguay', 'PY': 'Paraguay', 'BO': 'Bolivia',
    'EC': 'Ecuador', 'GF': 'French Guiana', 'FK': 'Falkland Islands',
    'GS': 'South Georgia and the South Sandwich Islands',
    'BQ': 'Bonaire, Sint Eustatius and Saba', 'CW': 'Curaçao', 'SX': 'Sint Maarten',
    'AW': 'Aruba', 'TC': 'Turks and Caicos Islands', 'BM': 'Bermuda',
    'GL': 'Greenland', 'FO': 'Faroe Islands', 'SJ': 'Svalbard and Jan Mayen',
    'AX': 'Åland Islands', 'GG': 'Guernsey', 'JE': 'Jersey', 'IM': 'Isle of Man'
  };
  
  return countryMap[countryCode] || countryCode;
}

// Generate SQL for import
function generateImportSQL(ports) {
  console.log('📝 Generating SQL for comprehensive port import...');
  
  const values = ports.map((port, index) => {
    const escape = (str) => str ? `'${str.replace(/'/g, "''")}'` : 'NULL';
    const bool = (val) => val ? 'true' : 'false';
    const num = (val) => val !== null ? val : 'NULL';
    
    return `(${escape(port.world_port_index)}, ${escape(port.region_name)}, ${escape(port.main_port_name)}, ${escape(port.alternate_port_name)},
    ${escape(port.un_locode)}, ${escape(port.country_code)}, ${escape(port.country_name)}, ${escape(port.world_water_body)}, ${escape(port.iho_sea_area)},
    ${num(port.latitude)}, ${num(port.longitude)}, ${escape(port.harbor_size)}, ${escape(port.harbor_type)}, ${escape(port.harbor_use)}, ${escape(port.shelter_afforded)},
    ${num(port.tidal_range)}, ${num(port.entrance_width)}, ${num(port.channel_depth)}, ${num(port.anchorage_depth)}, ${num(port.cargo_pier_depth)},
    ${num(port.max_vessel_length)}, ${num(port.max_vessel_beam)}, ${num(port.max_vessel_draft)},
    ${bool(port.pilotage_compulsory)}, ${bool(port.pilotage_available)}, ${bool(port.tugs_assistance)},
    ${bool(port.facilities_wharves)}, ${bool(port.facilities_anchorage)}, ${bool(port.facilities_container)},
    ${bool(port.facilities_oil_terminal)}, ${bool(port.facilities_lng_terminal)}, ${escape(port.search_text)},
    NOW(), NOW())`;
  }).join(',\n');
  
  const sql = `
-- Comprehensive Global Ports and Harbors Import
-- Generated from GeoNames.org allCountries data

DELETE FROM ports;

INSERT INTO ports (
  world_port_index, region_name, main_port_name, alternate_port_name,
  un_locode, country_code, country_name, world_water_body, iho_sea_area,
  latitude, longitude, harbor_size, harbor_type, harbor_use, shelter_afforded,
  tidal_range, entrance_width, channel_depth, anchorage_depth, cargo_pier_depth,
  max_vessel_length, max_vessel_beam, max_vessel_draft,
  pilotage_compulsory, pilotage_available, tugs_assistance,
  facilities_wharves, facilities_anchorage, facilities_container,
  facilities_oil_terminal, facilities_lng_terminal, search_text,
  created_at, updated_at
) VALUES ${values};
  `;
  
  return sql;
}

// Main function
async function main() {
  try {
    console.log('🚢 Starting COMPREHENSIVE port import from GeoNames.org (streaming)...');
    
    // Download the most comprehensive dataset
    await downloadGeoNamesData();
    await extractZip();
    
    // Process the data using streaming
    const ports = await processGeoNamesDataStreaming();
    
    if (ports.length === 0) {
      console.log('❌ No ports found in GeoNames data');
      return;
    }
    
    // Generate SQL
    const sql = generateImportSQL(ports);
    
    // Write SQL file
    fs.writeFileSync('sql/streaming_geonames_ports.sql', sql);
    console.log(`📄 SQL file created: sql/streaming_geonames_ports.sql`);
    console.log(`📊 Total ports prepared for import: ${ports.length}`);
    console.log('✅ Ready for import! This should give you thousands of ports worldwide.');
    
    // Clean up temp files
    if (fs.existsSync('temp/allCountries.zip')) {
      fs.unlinkSync('temp/allCountries.zip');
    }
    if (fs.existsSync('temp/allCountries.txt')) {
      fs.unlinkSync('temp/allCountries.txt');
    }
    console.log('🧹 Temporary files cleaned up');
    
  } catch (error) {
    console.error('❌ Import preparation failed:', error);
    throw error;
  }
}

// Run the import preparation
main()
  .then(() => {
    console.log('✅ Streaming GeoNames port import preparation completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Streaming GeoNames port import preparation failed:', error);
    process.exit(1);
  });
