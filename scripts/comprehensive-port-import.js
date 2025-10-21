const fs = require('fs');
const csv = require('csv-parser');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zurnrxtkmqtbcofwtild.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1cm5yeHRrbXF0YmNvZnd0aWxkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTM4NTIxMSwiZXhwIjoyMDc0OTYxMjExfQ.YourServiceRoleKey'
);

// Country code to name mapping
const countryMap = {
  'US': 'United States',
  'GB': 'United Kingdom',
  'DE': 'Germany',
  'NL': 'Netherlands',
  'BE': 'Belgium',
  'FR': 'France',
  'ES': 'Spain',
  'IT': 'Italy',
  'GR': 'Greece',
  'TR': 'Turkey',
  'RU': 'Russia',
  'CN': 'China',
  'JP': 'Japan',
  'KR': 'South Korea',
  'SG': 'Singapore',
  'HK': 'Hong Kong',
  'TW': 'Taiwan',
  'TH': 'Thailand',
  'MY': 'Malaysia',
  'ID': 'Indonesia',
  'PH': 'Philippines',
  'VN': 'Vietnam',
  'IN': 'India',
  'BD': 'Bangladesh',
  'PK': 'Pakistan',
  'AE': 'United Arab Emirates',
  'SA': 'Saudi Arabia',
  'EG': 'Egypt',
  'ZA': 'South Africa',
  'BR': 'Brazil',
  'AR': 'Argentina',
  'CL': 'Chile',
  'PE': 'Peru',
  'CO': 'Colombia',
  'VE': 'Venezuela',
  'MX': 'Mexico',
  'CA': 'Canada',
  'AU': 'Australia',
  'NZ': 'New Zealand',
  'NO': 'Norway',
  'SE': 'Sweden',
  'DK': 'Denmark',
  'FI': 'Finland',
  'PL': 'Poland',
  'CZ': 'Czech Republic',
  'HU': 'Hungary',
  'RO': 'Romania',
  'BG': 'Bulgaria',
  'HR': 'Croatia',
  'SI': 'Slovenia',
  'SK': 'Slovakia',
  'LT': 'Lithuania',
  'LV': 'Latvia',
  'EE': 'Estonia',
  'IE': 'Ireland',
  'PT': 'Portugal',
  'MT': 'Malta',
  'CY': 'Cyprus',
  'IS': 'Iceland',
  'LU': 'Luxembourg',
  'AT': 'Austria',
  'CH': 'Switzerland',
  'LI': 'Liechtenstein',
  'MC': 'Monaco',
  'SM': 'San Marino',
  'VA': 'Vatican City',
  'AD': 'Andorra',
  'GI': 'Gibraltar',
  'MG': 'Madagascar',
  'TZ': 'Tanzania',
  'KE': 'Kenya',
  'NG': 'Nigeria',
  'GH': 'Ghana',
  'MA': 'Morocco',
  'TN': 'Tunisia',
  'LY': 'Libya',
  'DZ': 'Algeria',
  'SD': 'Sudan',
  'ET': 'Ethiopia',
  'UG': 'Uganda',
  'RW': 'Rwanda',
  'BI': 'Burundi',
  'DJ': 'Djibouti',
  'SO': 'Somalia',
  'ER': 'Eritrea',
  'SS': 'South Sudan',
  'CF': 'Central African Republic',
  'TD': 'Chad',
  'NE': 'Niger',
  'ML': 'Mali',
  'BF': 'Burkina Faso',
  'SN': 'Senegal',
  'GM': 'Gambia',
  'GW': 'Guinea-Bissau',
  'GN': 'Guinea',
  'SL': 'Sierra Leone',
  'LR': 'Liberia',
  'CI': 'Ivory Coast',
  'GH': 'Ghana',
  'TG': 'Togo',
  'BJ': 'Benin',
  'CM': 'Cameroon',
  'GQ': 'Equatorial Guinea',
  'GA': 'Gabon',
  'CG': 'Republic of the Congo',
  'CD': 'Democratic Republic of the Congo',
  'AO': 'Angola',
  'ZM': 'Zambia',
  'ZW': 'Zimbabwe',
  'BW': 'Botswana',
  'NA': 'Namibia',
  'SZ': 'Eswatini',
  'LS': 'Lesotho',
  'MW': 'Malawi',
  'MZ': 'Mozambique',
  'MG': 'Madagascar',
  'MU': 'Mauritius',
  'SC': 'Seychelles',
  'KM': 'Comoros',
  'YT': 'Mayotte',
  'RE': 'Réunion',
  'SH': 'Saint Helena, Ascension, and Tristan da Cunha',
  'CV': 'Cape Verde',
  'ST': 'São Tomé and Príncipe',
  'GQ': 'Equatorial Guinea',
  'SH': 'Saint Helena, Ascension, and Tristan da Cunha'
};

// Additional major ports not in the CSV
const additionalPorts = [
  // Major container ports
  { name: 'Port of Busan', country: 'South Korea', city: 'Busan', code: 'KRPUS', lat: 35.1796, lng: 129.0756 },
  { name: 'Port of Kaohsiung', country: 'Taiwan', city: 'Kaohsiung', code: 'TWKHH', lat: 22.6273, lng: 120.3014 },
  { name: 'Port of Tanjung Pelepas', country: 'Malaysia', city: 'Johor', code: 'MYTPP', lat: 1.3644, lng: 103.5503 },
  { name: 'Port of Laem Chabang', country: 'Thailand', city: 'Laem Chabang', code: 'THLCH', lat: 13.0833, lng: 100.8833 },
  { name: 'Port of Tanjung Priok', country: 'Indonesia', city: 'Jakarta', code: 'IDTPP', lat: -6.1139, lng: 106.8788 },
  { name: 'Port of Manila', country: 'Philippines', city: 'Manila', code: 'PHMNL', lat: 14.5995, lng: 120.9842 },
  { name: 'Port of Ho Chi Minh City', country: 'Vietnam', city: 'Ho Chi Minh City', code: 'VNSGN', lat: 10.7769, lng: 106.7009 },
  { name: 'Port of Mumbai', country: 'India', city: 'Mumbai', code: 'INBOM', lat: 19.0760, lng: 72.8777 },
  { name: 'Port of Chennai', country: 'India', city: 'Chennai', code: 'INMAA', lat: 13.0827, lng: 80.2707 },
  { name: 'Port of Colombo', country: 'Sri Lanka', city: 'Colombo', code: 'LKCMB', lat: 6.9271, lng: 79.8612 },
  { name: 'Port of Chittagong', country: 'Bangladesh', city: 'Chittagong', code: 'BDCGP', lat: 22.3569, lng: 91.7832 },
  { name: 'Port of Karachi', country: 'Pakistan', city: 'Karachi', code: 'PKKHI', lat: 24.8607, lng: 67.0011 },
  { name: 'Port of Jebel Ali', country: 'United Arab Emirates', city: 'Dubai', code: 'AEJEA', lat: 25.0333, lng: 55.1167 },
  { name: 'Port of Dammam', country: 'Saudi Arabia', city: 'Dammam', code: 'SADMM', lat: 26.4207, lng: 50.0888 },
  { name: 'Port of Alexandria', country: 'Egypt', city: 'Alexandria', code: 'EGALY', lat: 31.2001, lng: 29.9187 },
  { name: 'Port of Durban', country: 'South Africa', city: 'Durban', code: 'ZADUR', lat: -29.8587, lng: 31.0218 },
  { name: 'Port of Cape Town', country: 'South Africa', city: 'Cape Town', code: 'ZACPT', lat: -33.9249, lng: 18.4241 },
  { name: 'Port of Santos', country: 'Brazil', city: 'Santos', code: 'BRSSZ', lat: -23.9608, lng: -46.3331 },
  { name: 'Port of Buenos Aires', country: 'Argentina', city: 'Buenos Aires', code: 'ARBUE', lat: -34.6118, lng: -58.3960 },
  { name: 'Port of Valparaiso', country: 'Chile', city: 'Valparaiso', code: 'CLVAP', lat: -33.0458, lng: -71.6197 },
  { name: 'Port of Callao', country: 'Peru', city: 'Callao', code: 'PECLL', lat: -12.0464, lng: -77.0428 },
  { name: 'Port of Cartagena', country: 'Colombia', city: 'Cartagena', code: 'COCGB', lat: 10.3910, lng: -75.4794 },
  { name: 'Port of Maracaibo', country: 'Venezuela', city: 'Maracaibo', code: 'VEMAR', lat: 10.6427, lng: -71.6125 },
  { name: 'Port of Veracruz', country: 'Mexico', city: 'Veracruz', code: 'MXVER', lat: 19.2000, lng: -96.1333 },
  { name: 'Port of Vancouver', country: 'Canada', city: 'Vancouver', code: 'CAVAN', lat: 49.2827, lng: -123.1207 },
  { name: 'Port of Montreal', country: 'Canada', city: 'Montreal', code: 'CAMTR', lat: 45.5017, lng: -73.5673 },
  { name: 'Port of Sydney', country: 'Australia', city: 'Sydney', code: 'AUSYD', lat: -33.8688, lng: 151.2093 },
  { name: 'Port of Melbourne', country: 'Australia', city: 'Melbourne', code: 'AUMEL', lat: -37.8136, lng: 144.9631 },
  { name: 'Port of Auckland', country: 'New Zealand', city: 'Auckland', code: 'NZAKL', lat: -36.8485, lng: 174.7633 },
  { name: 'Port of Wellington', country: 'New Zealand', city: 'Wellington', code: 'NZWLG', lat: -41.2924, lng: 174.7787 },
  { name: 'Port of Oslo', country: 'Norway', city: 'Oslo', code: 'NOOSL', lat: 59.9139, lng: 10.7522 },
  { name: 'Port of Gothenburg', country: 'Sweden', city: 'Gothenburg', code: 'SEGOT', lat: 57.7089, lng: 11.9746 },
  { name: 'Port of Copenhagen', country: 'Denmark', city: 'Copenhagen', code: 'DKCPH', lat: 55.6761, lng: 12.5683 },
  { name: 'Port of Helsinki', country: 'Finland', city: 'Helsinki', code: 'FIHEL', lat: 60.1699, lng: 24.9384 },
  { name: 'Port of Gdansk', country: 'Poland', city: 'Gdansk', code: 'PLGDN', lat: 54.3520, lng: 18.6466 },
  { name: 'Port of Gdynia', country: 'Poland', city: 'Gdynia', code: 'PLGDY', lat: 54.5189, lng: 18.5305 },
  { name: 'Port of Klaipeda', country: 'Lithuania', city: 'Klaipeda', code: 'LTKLJ', lat: 55.7033, lng: 21.1443 },
  { name: 'Port of Riga', country: 'Latvia', city: 'Riga', code: 'LVRIX', lat: 56.9496, lng: 24.1052 },
  { name: 'Port of Tallinn', country: 'Estonia', city: 'Tallinn', code: 'EETLL', lat: 59.4370, lng: 24.7536 },
  { name: 'Port of Dublin', country: 'Ireland', city: 'Dublin', code: 'IEDUB', lat: 53.3498, lng: -6.2603 },
  { name: 'Port of Cork', country: 'Ireland', city: 'Cork', code: 'IECOR', lat: 51.8985, lng: -8.4756 },
  { name: 'Port of Lisbon', country: 'Portugal', city: 'Lisbon', code: 'PTLIS', lat: 38.7223, lng: -9.1393 },
  { name: 'Port of Leixões', country: 'Portugal', city: 'Porto', code: 'PTOPO', lat: 41.1579, lng: -8.6291 },
  { name: 'Port of Valletta', country: 'Malta', city: 'Valletta', code: 'MTMLA', lat: 35.8989, lng: 14.5146 },
  { name: 'Port of Limassol', country: 'Cyprus', city: 'Limassol', code: 'CYLIM', lat: 34.7071, lng: 33.0226 },
  { name: 'Port of Reykjavik', country: 'Iceland', city: 'Reykjavik', code: 'ISREK', lat: 64.1466, lng: -21.9426 },
  { name: 'Port of Luxembourg', country: 'Luxembourg', city: 'Luxembourg', code: 'LULUX', lat: 49.6116, lng: 6.1319 },
  { name: 'Port of Vienna', country: 'Austria', city: 'Vienna', code: 'ATVIE', lat: 48.2082, lng: 16.3738 },
  { name: 'Port of Basel', country: 'Switzerland', city: 'Basel', code: 'CHBSL', lat: 47.5596, lng: 7.5886 },
  { name: 'Port of Vaduz', country: 'Liechtenstein', city: 'Vaduz', code: 'LIVAD', lat: 47.1410, lng: 9.5209 },
  { name: 'Port of Monaco', country: 'Monaco', city: 'Monaco', code: 'MCMON', lat: 43.7384, lng: 7.4246 },
  { name: 'Port of San Marino', country: 'San Marino', city: 'San Marino', code: 'SMSMR', lat: 43.9424, lng: 12.4578 },
  { name: 'Port of Vatican City', country: 'Vatican City', city: 'Vatican City', code: 'VAVAT', lat: 41.9029, lng: 12.4534 },
  { name: 'Port of Andorra', country: 'Andorra', city: 'Andorra la Vella', code: 'ADALV', lat: 42.5063, lng: 1.5218 },
  { name: 'Port of Gibraltar', country: 'Gibraltar', city: 'Gibraltar', code: 'GIGIB', lat: 36.1408, lng: -5.3536 }
];

async function importPorts() {
  const ports = [];
  
  console.log('🚢 Starting comprehensive port import...');
  
  // First, import from CSV file
  console.log('📄 Reading CSV file...');
  
  return new Promise((resolve, reject) => {
    fs.createReadStream('Listofports/UpdatedPub150.csv')
      .pipe(csv())
      .on('data', (row) => {
        // Extract relevant fields from CSV
        const port = {
          world_port_index: row['World Port Index Number'] || null,
          region_name: row['Region Name'] || null,
          main_port_name: row['Main Port Name'] || null,
          alternate_port_name: row['Alternate Port Name'] || null,
          un_locode: row['UN/LOCODE'] || null,
          country_code: row['Country Code'] || null,
          country_name: countryMap[row['Country Code']] || null,
          world_water_body: row['World Water Body'] || null,
          iho_sea_area: row['IHO S-130 Sea Area'] || null,
          latitude: parseFloat(row['Latitude']) || null,
          longitude: parseFloat(row['Longitude']) || null,
          harbor_size: row['Harbor Size'] || null,
          harbor_type: row['Harbor Type'] || null,
          harbor_use: row['Harbor Use'] || null,
          shelter_afforded: row['Shelter Afforded'] || null,
          tidal_range: parseFloat(row['Tidal Range (m)']) || null,
          entrance_width: parseFloat(row['Entrance Width (m)']) || null,
          channel_depth: parseFloat(row['Channel Depth (m)']) || null,
          anchorage_depth: parseFloat(row['Anchorage Depth (m)']) || null,
          cargo_pier_depth: parseFloat(row['Cargo Pier Depth (m)']) || null,
          max_vessel_length: parseFloat(row['Maximum Vessel Length (m)']) || null,
          max_vessel_beam: parseFloat(row['Maximum Vessel Beam (m)']) || null,
          max_vessel_draft: parseFloat(row['Maximum Vessel Draft (m)']) || null,
          pilotage_compulsory: row['Pilotage - Compulsory'] === 'Yes',
          pilotage_available: row['Pilotage - Available'] === 'Yes',
          tugs_assistance: row['Tugs - Assistance'] === 'Yes',
          facilities_wharves: row['Facilities - Wharves'] === 'Yes',
          facilities_anchorage: row['Facilities - Anchorage'] === 'Yes',
          facilities_container: row['Facilities - Container'] === 'Yes',
          facilities_oil_terminal: row['Facilities - Oil Terminal'] === 'Yes',
          facilities_lng_terminal: row['Facilities - LNG Terminal'] === 'Yes',
          search_text: `${row['Main Port Name'] || ''} ${row['Alternate Port Name'] || ''} ${row['Region Name'] || ''} ${row['Country Code'] || ''} ${countryMap[row['Country Code']] || ''}`.toLowerCase().trim()
        };
        
        if (port.main_port_name && port.main_port_name !== 'Unknown Port') {
          ports.push(port);
        }
      })
      .on('end', async () => {
        try {
          console.log(`📊 CSV import completed. Found ${ports.length} ports from CSV.`);
          
          // Add additional major ports
          console.log('🌍 Adding additional major ports...');
          additionalPorts.forEach(port => {
            ports.push({
              world_port_index: null,
              region_name: null,
              main_port_name: port.name,
              alternate_port_name: null,
              un_locode: port.code,
              country_code: port.code.substring(0, 2),
              country_name: port.country,
              world_water_body: null,
              iho_sea_area: null,
              latitude: port.lat,
              longitude: port.lng,
              harbor_size: 'Large',
              harbor_type: 'Coastal (Artificial)',
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
              pilotage_compulsory: true,
              pilotage_available: true,
              tugs_assistance: true,
              facilities_wharves: true,
              facilities_anchorage: true,
              facilities_container: true,
              facilities_oil_terminal: true,
              facilities_lng_terminal: false,
              search_text: `${port.name} ${port.city} ${port.country} ${port.code}`.toLowerCase().trim()
            });
          });
          
          console.log(`🌍 Total ports to import: ${ports.length}`);
          
          // Clear existing ports
          console.log('🗑️ Clearing existing ports...');
          const { error: deleteError } = await supabase
            .from('ports')
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000');
          
          if (deleteError) {
            console.error('❌ Error clearing ports:', deleteError);
            reject(deleteError);
            return;
          }
          
          // Insert ports in batches
          console.log('📥 Inserting ports in batches...');
          const batchSize = 1000;
          for (let i = 0; i < ports.length; i += batchSize) {
            const batch = ports.slice(i, i + batchSize);
            const { error } = await supabase
              .from('ports')
              .insert(batch);
            
            if (error) {
              console.error(`❌ Error inserting batch ${i}-${i + batchSize}:`, error);
              reject(error);
              return;
            }
            
            console.log(`✅ Inserted batch ${i + 1}-${Math.min(i + batchSize, ports.length)} (${Math.min(i + batchSize, ports.length)}/${ports.length})`);
          }
          
          console.log('🎉 Comprehensive port import completed successfully!');
          console.log(`📊 Total ports imported: ${ports.length}`);
          resolve();
        } catch (error) {
          console.error('❌ Error during import:', error);
          reject(error);
        }
      })
      .on('error', (error) => {
        console.error('❌ Error reading CSV:', error);
        reject(error);
      });
  });
}

// Run the import
importPorts()
  .then(() => {
    console.log('✅ Import completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Import failed:', error);
    process.exit(1);
  });
