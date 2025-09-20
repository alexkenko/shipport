// Comprehensive port database for marine superintendents
// This includes major international ports where marine superintendents commonly work

export interface Port {
  id: string
  name: string
  country: string
  city: string
  code: string
  coordinates?: {
    lat: number
    lng: number
  }
}

export const MAJOR_PORTS: Port[] = [
  // United States
  { id: 'us-lax', name: 'Port of Los Angeles', country: 'United States', city: 'Los Angeles', code: 'USLAX', coordinates: { lat: 33.7175, lng: -118.2681 } },
  { id: 'us-lgb', name: 'Port of Long Beach', country: 'United States', city: 'Long Beach', code: 'USLGB', coordinates: { lat: 33.7537, lng: -118.1894 } },
  { id: 'us-nyc', name: 'Port of New York and New Jersey', country: 'United States', city: 'New York', code: 'USNYC', coordinates: { lat: 40.6892, lng: -74.0445 } },
  { id: 'us-hou', name: 'Port of Houston', country: 'United States', city: 'Houston', code: 'USHOU', coordinates: { lat: 29.7604, lng: -95.3698 } },
  { id: 'us-sav', name: 'Port of Savannah', country: 'United States', city: 'Savannah', code: 'USSAV', coordinates: { lat: 32.0835, lng: -81.0998 } },
  { id: 'us-mia', name: 'Port of Miami', country: 'United States', city: 'Miami', code: 'USMIA', coordinates: { lat: 25.7617, lng: -80.1918 } },
  { id: 'us-sea', name: 'Port of Seattle', country: 'United States', city: 'Seattle', code: 'USSEA', coordinates: { lat: 47.6062, lng: -122.3321 } },
  { id: 'us-oak', name: 'Port of Oakland', country: 'United States', city: 'Oakland', code: 'USOAK', coordinates: { lat: 37.8044, lng: -122.2712 } },

  // United Kingdom
  { id: 'gb-lon', name: 'Port of London', country: 'United Kingdom', city: 'London', code: 'GBLON', coordinates: { lat: 51.5074, lng: -0.1278 } },
  { id: 'gb-liv', name: 'Port of Liverpool', country: 'United Kingdom', city: 'Liverpool', code: 'GBLIV', coordinates: { lat: 53.4084, lng: -2.9916 } },
  { id: 'gb-sou', name: 'Port of Southampton', country: 'United Kingdom', city: 'Southampton', code: 'GBSOU', coordinates: { lat: 50.9097, lng: -1.4044 } },
  { id: 'gb-fxt', name: 'Port of Felixstowe', country: 'United Kingdom', city: 'Felixstowe', code: 'GBFXT', coordinates: { lat: 51.9508, lng: 1.3495 } },

  // Germany
  { id: 'de-ham', name: 'Port of Hamburg', country: 'Germany', city: 'Hamburg', code: 'DEHAM', coordinates: { lat: 53.5511, lng: 9.9937 } },
  { id: 'de-brv', name: 'Port of Bremerhaven', country: 'Germany', city: 'Bremerhaven', code: 'DEBRV', coordinates: { lat: 53.5483, lng: 8.5767 } },
  { id: 'de-bre', name: 'Port of Bremen', country: 'Germany', city: 'Bremen', code: 'DEBRE', coordinates: { lat: 53.0793, lng: 8.8017 } },

  // Netherlands
  { id: 'nl-rtm', name: 'Port of Rotterdam', country: 'Netherlands', city: 'Rotterdam', code: 'NLRTM', coordinates: { lat: 51.9244, lng: 4.4777 } },
  { id: 'nl-ams', name: 'Port of Amsterdam', country: 'Netherlands', city: 'Amsterdam', code: 'NLAMS', coordinates: { lat: 52.3676, lng: 4.9041 } },

  // Belgium
  { id: 'be-anr', name: 'Port of Antwerp', country: 'Belgium', city: 'Antwerp', code: 'BEANR', coordinates: { lat: 51.2194, lng: 4.4025 } },
  { id: 'be-zee', name: 'Port of Zeebrugge', country: 'Belgium', city: 'Zeebrugge', code: 'BEZEE', coordinates: { lat: 51.3314, lng: 3.2083 } },

  // France
  { id: 'fr-leh', name: 'Port of Le Havre', country: 'France', city: 'Le Havre', code: 'FRLEH', coordinates: { lat: 49.4944, lng: 0.1075 } },
  { id: 'fr-mrs', name: 'Port of Marseille', country: 'France', city: 'Marseille', code: 'FRMRS', coordinates: { lat: 43.2965, lng: 5.3698 } },

  // Italy
  { id: 'it-goa', name: 'Port of Genoa', country: 'Italy', city: 'Genoa', code: 'ITGOA', coordinates: { lat: 44.4056, lng: 8.9463 } },
  { id: 'it-spe', name: 'Port of La Spezia', country: 'Italy', city: 'La Spezia', code: 'ITSPE', coordinates: { lat: 44.1025, lng: 9.8278 } },
  { id: 'it-nap', name: 'Port of Naples', country: 'Italy', city: 'Naples', code: 'ITNAP', coordinates: { lat: 40.8518, lng: 14.2681 } },

  // Spain
  { id: 'es-vlc', name: 'Port of Valencia', country: 'Spain', city: 'Valencia', code: 'ESVLC', coordinates: { lat: 39.4699, lng: -0.3763 } },
  { id: 'es-bcn', name: 'Port of Barcelona', country: 'Spain', city: 'Barcelona', code: 'ESBCN', coordinates: { lat: 41.3851, lng: 2.1734 } },
  { id: 'es-alg', name: 'Port of Algeciras', country: 'Spain', city: 'Algeciras', code: 'ESALG', coordinates: { lat: 36.1408, lng: -5.4536 } },

  // Greece
  { id: 'gr-pir', name: 'Port of Piraeus', country: 'Greece', city: 'Athens', code: 'GRPIR', coordinates: { lat: 37.9755, lng: 23.7348 } },
  { id: 'gr-skg', name: 'Port of Thessaloniki', country: 'Greece', city: 'Thessaloniki', code: 'GRSKG', coordinates: { lat: 40.6401, lng: 22.9444 } },

  // Turkey
  { id: 'tr-ist', name: 'Port of Istanbul', country: 'Turkey', city: 'Istanbul', code: 'TRIST', coordinates: { lat: 41.0082, lng: 28.9784 } },
  { id: 'tr-izm', name: 'Port of Izmir', country: 'Turkey', city: 'Izmir', code: 'TRIZM', coordinates: { lat: 38.4192, lng: 27.1287 } },

  // Singapore
  { id: 'sg-sin', name: 'Port of Singapore', country: 'Singapore', city: 'Singapore', code: 'SGSIN', coordinates: { lat: 1.3521, lng: 103.8198 } },

  // China
  { id: 'cn-sha', name: 'Port of Shanghai', country: 'China', city: 'Shanghai', code: 'CNSHA', coordinates: { lat: 31.2304, lng: 121.4737 } },
  { id: 'cn-szx', name: 'Port of Shenzhen', country: 'China', city: 'Shenzhen', code: 'CNSZX', coordinates: { lat: 22.5431, lng: 114.0579 } },
  { id: 'cn-ngb', name: 'Port of Ningbo-Zhoushan', country: 'China', city: 'Ningbo', code: 'CNNGB', coordinates: { lat: 29.8683, lng: 121.5440 } },
  { id: 'cn-tao', name: 'Port of Qingdao', country: 'China', city: 'Qingdao', code: 'CNTAO', coordinates: { lat: 36.0986, lng: 120.3719 } },
  { id: 'cn-tsn', name: 'Port of Tianjin', country: 'China', city: 'Tianjin', code: 'CNTSN', coordinates: { lat: 39.3434, lng: 117.3616 } },

  // Japan
  { id: 'jp-tyo', name: 'Port of Tokyo', country: 'Japan', city: 'Tokyo', code: 'JPTYO', coordinates: { lat: 35.6762, lng: 139.6503 } },
  { id: 'jp-yok', name: 'Port of Yokohama', country: 'Japan', city: 'Yokohama', code: 'JPYOK', coordinates: { lat: 35.4437, lng: 139.6380 } },
  { id: 'jp-ukb', name: 'Port of Kobe', country: 'Japan', city: 'Kobe', code: 'JPUKB', coordinates: { lat: 34.6901, lng: 135.1956 } },
  { id: 'jp-osa', name: 'Port of Osaka', country: 'Japan', city: 'Osaka', code: 'JPOSA', coordinates: { lat: 34.6937, lng: 135.5023 } },

  // South Korea
  { id: 'kr-pus', name: 'Port of Busan', country: 'South Korea', city: 'Busan', code: 'KRPUS', coordinates: { lat: 35.1796, lng: 129.0756 } },
  { id: 'kr-inc', name: 'Port of Incheon', country: 'South Korea', city: 'Incheon', code: 'KRINC', coordinates: { lat: 37.4563, lng: 126.7052 } },

  // Australia
  { id: 'au-mel', name: 'Port of Melbourne', country: 'Australia', city: 'Melbourne', code: 'AUMEL', coordinates: { lat: -37.8136, lng: 144.9631 } },
  { id: 'au-syd', name: 'Port of Sydney', country: 'Australia', city: 'Sydney', code: 'AUSYD', coordinates: { lat: -33.8688, lng: 151.2093 } },
  { id: 'au-bne', name: 'Port of Brisbane', country: 'Australia', city: 'Brisbane', code: 'AUBNE', coordinates: { lat: -27.4698, lng: 153.0251 } },
  { id: 'au-per', name: 'Port of Perth', country: 'Australia', city: 'Perth', code: 'AUPER', coordinates: { lat: -31.9505, lng: 115.8605 } },

  // Canada
  { id: 'ca-van', name: 'Port of Vancouver', country: 'Canada', city: 'Vancouver', code: 'CAVAN', coordinates: { lat: 49.2827, lng: -123.1207 } },
  { id: 'ca-mtr', name: 'Port of Montreal', country: 'Canada', city: 'Montreal', code: 'CAMTR', coordinates: { lat: 45.5017, lng: -73.5673 } },
  { id: 'ca-hal', name: 'Port of Halifax', country: 'Canada', city: 'Halifax', code: 'CAHAL', coordinates: { lat: 44.6488, lng: -63.5752 } },

  // Brazil
  { id: 'br-sts', name: 'Port of Santos', country: 'Brazil', city: 'Santos', code: 'BRSTS', coordinates: { lat: -23.9618, lng: -46.3322 } },
  { id: 'br-rio', name: 'Port of Rio de Janeiro', country: 'Brazil', city: 'Rio de Janeiro', code: 'BRRIO', coordinates: { lat: -22.9068, lng: -43.1729 } },

  // Argentina
  { id: 'ar-bue', name: 'Port of Buenos Aires', country: 'Argentina', city: 'Buenos Aires', code: 'ARBUE', coordinates: { lat: -34.6118, lng: -58.3960 } },

  // Chile
  { id: 'cl-vap', name: 'Port of Valparaiso', country: 'Chile', city: 'Valparaiso', code: 'CLVAP', coordinates: { lat: -33.0458, lng: -71.6197 } },

  // South Africa
  { id: 'za-cpt', name: 'Port of Cape Town', country: 'South Africa', city: 'Cape Town', code: 'ZACPT', coordinates: { lat: -33.9249, lng: 18.4241 } },
  { id: 'za-dur', name: 'Port of Durban', country: 'South Africa', city: 'Durban', code: 'ZADUR', coordinates: { lat: -29.8587, lng: 31.0218 } },

  // India
  { id: 'in-bom', name: 'Port of Mumbai', country: 'India', city: 'Mumbai', code: 'INBOM', coordinates: { lat: 19.0760, lng: 72.8777 } },
  { id: 'in-maa', name: 'Port of Chennai', country: 'India', city: 'Chennai', code: 'INMAA', coordinates: { lat: 13.0827, lng: 80.2707 } },
  { id: 'in-ccu', name: 'Port of Kolkata', country: 'India', city: 'Kolkata', code: 'INCCU', coordinates: { lat: 22.5726, lng: 88.3639 } },

  // Thailand
  { id: 'th-lcb', name: 'Port of Laem Chabang', country: 'Thailand', city: 'Laem Chabang', code: 'THLCB', coordinates: { lat: 13.0866, lng: 100.8837 } },
  { id: 'th-bkk', name: 'Port of Bangkok', country: 'Thailand', city: 'Bangkok', code: 'THBKK', coordinates: { lat: 13.7563, lng: 100.5018 } },

  // Malaysia
  { id: 'my-pkg', name: 'Port of Klang', country: 'Malaysia', city: 'Klang', code: 'MYPKG', coordinates: { lat: 3.0042, lng: 101.3899 } },
  { id: 'my-pen', name: 'Port of Penang', country: 'Malaysia', city: 'Penang', code: 'MYPEN', coordinates: { lat: 5.4164, lng: 100.3327 } },

  // Indonesia
  { id: 'id-jkt', name: 'Port of Jakarta', country: 'Indonesia', city: 'Jakarta', code: 'IDJKT', coordinates: { lat: -6.2088, lng: 106.8456 } },
  { id: 'id-sub', name: 'Port of Surabaya', country: 'Indonesia', city: 'Surabaya', code: 'IDSUB', coordinates: { lat: -7.2575, lng: 112.7521 } },

  // Philippines
  { id: 'ph-mnl', name: 'Port of Manila', country: 'Philippines', city: 'Manila', code: 'PHMNL', coordinates: { lat: 14.5995, lng: 120.9842 } },

  // Vietnam
  { id: 'vn-sgn', name: 'Port of Ho Chi Minh City', country: 'Vietnam', city: 'Ho Chi Minh City', code: 'VNSGN', coordinates: { lat: 10.8231, lng: 106.6297 } },
  { id: 'vn-hph', name: 'Port of Haiphong', country: 'Vietnam', city: 'Haiphong', code: 'VNHPH', coordinates: { lat: 20.8449, lng: 106.6881 } },

  // United Arab Emirates
  { id: 'ae-dxb', name: 'Port of Dubai', country: 'United Arab Emirates', city: 'Dubai', code: 'AEDXB', coordinates: { lat: 25.2048, lng: 55.2708 } },
  { id: 'ae-auh', name: 'Port of Abu Dhabi', country: 'United Arab Emirates', city: 'Abu Dhabi', code: 'AEAUH', coordinates: { lat: 24.4539, lng: 54.3773 } },

  // Saudi Arabia
  { id: 'sa-jed', name: 'Port of Jeddah', country: 'Saudi Arabia', city: 'Jeddah', code: 'SAJED', coordinates: { lat: 21.4858, lng: 39.1925 } },
  { id: 'sa-dam', name: 'Port of Dammam', country: 'Saudi Arabia', city: 'Dammam', code: 'SADAM', coordinates: { lat: 26.4207, lng: 50.0888 } },

  // Egypt
  { id: 'eg-aly', name: 'Port of Alexandria', country: 'Egypt', city: 'Alexandria', code: 'EGALY', coordinates: { lat: 31.2001, lng: 29.9187 } },
  { id: 'eg-suz', name: 'Port of Suez', country: 'Egypt', city: 'Suez', code: 'EGSUZ', coordinates: { lat: 29.9668, lng: 32.5498 } },

  // Russia
  { id: 'ru-led', name: 'Port of St. Petersburg', country: 'Russia', city: 'St. Petersburg', code: 'RULED', coordinates: { lat: 59.9311, lng: 30.3609 } },
  { id: 'ru-vvo', name: 'Port of Vladivostok', country: 'Russia', city: 'Vladivostok', code: 'RUVVO', coordinates: { lat: 43.1056, lng: 131.8735 } },

  // Norway
  { id: 'no-osl', name: 'Port of Oslo', country: 'Norway', city: 'Oslo', code: 'NOOSL', coordinates: { lat: 59.9139, lng: 10.7522 } },
  { id: 'no-bgo', name: 'Port of Bergen', country: 'Norway', city: 'Bergen', code: 'NOBGO', coordinates: { lat: 60.3913, lng: 5.3221 } },

  // Sweden
  { id: 'se-got', name: 'Port of Gothenburg', country: 'Sweden', city: 'Gothenburg', code: 'SEGOT', coordinates: { lat: 57.7089, lng: 11.9746 } },
  { id: 'se-sto', name: 'Port of Stockholm', country: 'Sweden', city: 'Stockholm', code: 'SESTO', coordinates: { lat: 59.3293, lng: 18.0686 } },

  // Denmark
  { id: 'dk-cph', name: 'Port of Copenhagen', country: 'Denmark', city: 'Copenhagen', code: 'DKCPH', coordinates: { lat: 55.6761, lng: 12.5683 } },
  { id: 'dk-aar', name: 'Port of Aarhus', country: 'Denmark', city: 'Aarhus', code: 'DKAAR', coordinates: { lat: 56.1572, lng: 10.2107 } },

  // Poland
  { id: 'pl-gdn', name: 'Port of Gdansk', country: 'Poland', city: 'Gdansk', code: 'PLGDN', coordinates: { lat: 54.3520, lng: 18.6466 } },
  { id: 'pl-gdy', name: 'Port of Gdynia', country: 'Poland', city: 'Gdynia', code: 'PLGDY', coordinates: { lat: 54.5189, lng: 18.5305 } },

  // Finland
  { id: 'fi-hel', name: 'Port of Helsinki', country: 'Finland', city: 'Helsinki', code: 'FIHEL', coordinates: { lat: 60.1699, lng: 24.9384 } },
  { id: 'fi-tku', name: 'Port of Turku', country: 'Finland', city: 'Turku', code: 'FITKU', coordinates: { lat: 60.4518, lng: 22.2666 } }
]

export const searchPorts = (query: string): Port[] => {
  if (!query.trim()) return MAJOR_PORTS.slice(0, 50) // Return first 50 for performance
  
  const lowerQuery = query.toLowerCase()
  return MAJOR_PORTS.filter(port => 
    port.name.toLowerCase().includes(lowerQuery) ||
    port.city.toLowerCase().includes(lowerQuery) ||
    port.country.toLowerCase().includes(lowerQuery) ||
    port.code.toLowerCase().includes(lowerQuery)
  ).slice(0, 100) // Limit results for performance
}

export const getPortByCode = (code: string): Port | undefined => {
  return MAJOR_PORTS.find(port => port.code.toLowerCase() === code.toLowerCase())
}

export const getPortsByCountry = (country: string): Port[] => {
  return MAJOR_PORTS.filter(port => 
    port.country.toLowerCase().includes(country.toLowerCase())
  )
}
