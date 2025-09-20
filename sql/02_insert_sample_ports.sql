-- Insert comprehensive port database
-- Major international ports for marine superintendents

INSERT INTO ports (name, country, city, code, coordinates) VALUES
-- United States
('Port of Los Angeles', 'United States', 'Los Angeles', 'USLAX', '{"lat": 33.7175, "lng": -118.2681}'),
('Port of Long Beach', 'United States', 'Long Beach', 'USLGB', '{"lat": 33.7537, "lng": -118.1894}'),
('Port of New York and New Jersey', 'United States', 'New York', 'USNYC', '{"lat": 40.6892, "lng": -74.0445}'),
('Port of Houston', 'United States', 'Houston', 'USHOU', '{"lat": 29.7604, "lng": -95.3698}'),
('Port of Savannah', 'United States', 'Savannah', 'USSAV', '{"lat": 32.0835, "lng": -81.0998}'),
('Port of Miami', 'United States', 'Miami', 'USMIA', '{"lat": 25.7617, "lng": -80.1918}'),
('Port of Seattle', 'United States', 'Seattle', 'USSEA', '{"lat": 47.6062, "lng": -122.3321}'),
('Port of Oakland', 'United States', 'Oakland', 'USOAK', '{"lat": 37.8044, "lng": -122.2712}'),

-- United Kingdom
('Port of London', 'United Kingdom', 'London', 'GBLON', '{"lat": 51.5074, "lng": -0.1278}'),
('Port of Liverpool', 'United Kingdom', 'Liverpool', 'GBLIV', '{"lat": 53.4084, "lng": -2.9916}'),
('Port of Southampton', 'United Kingdom', 'Southampton', 'GBSOU', '{"lat": 50.9097, "lng": -1.4044}'),
('Port of Felixstowe', 'United Kingdom', 'Felixstowe', 'GBFXT', '{"lat": 51.9508, "lng": 1.3495}'),

-- Germany
('Port of Hamburg', 'Germany', 'Hamburg', 'DEHAM', '{"lat": 53.5511, "lng": 9.9937}'),
('Port of Bremerhaven', 'Germany', 'Bremerhaven', 'DEBRV', '{"lat": 53.5483, "lng": 8.5767}'),
('Port of Bremen', 'Germany', 'Bremen', 'DEBRE', '{"lat": 53.0793, "lng": 8.8017}'),

-- Netherlands
('Port of Rotterdam', 'Netherlands', 'Rotterdam', 'NLRTM', '{"lat": 51.9244, "lng": 4.4777}'),
('Port of Amsterdam', 'Netherlands', 'Amsterdam', 'NLAMS', '{"lat": 52.3676, "lng": 4.9041}'),

-- Belgium
('Port of Antwerp', 'Belgium', 'Antwerp', 'BEANR', '{"lat": 51.2194, "lng": 4.4025}'),
('Port of Zeebrugge', 'Belgium', 'Zeebrugge', 'BEZEE', '{"lat": 51.3314, "lng": 3.2083}'),

-- France
('Port of Le Havre', 'France', 'Le Havre', 'FRLEH', '{"lat": 49.4944, "lng": 0.1075}'),
('Port of Marseille', 'France', 'Marseille', 'FRMRS', '{"lat": 43.2965, "lng": 5.3698}'),

-- Italy
('Port of Genoa', 'Italy', 'Genoa', 'ITGOA', '{"lat": 44.4056, "lng": 8.9463}'),
('Port of La Spezia', 'Italy', 'La Spezia', 'ITSPE', '{"lat": 44.1025, "lng": 9.8278}'),
('Port of Naples', 'Italy', 'Naples', 'ITNAP', '{"lat": 40.8518, "lng": 14.2681}'),

-- Spain
('Port of Valencia', 'Spain', 'Valencia', 'ESVLC', '{"lat": 39.4699, "lng": -0.3763}'),
('Port of Barcelona', 'Spain', 'Barcelona', 'ESBCN', '{"lat": 41.3851, "lng": 2.1734}'),
('Port of Algeciras', 'Spain', 'Algeciras', 'ESALG', '{"lat": 36.1408, "lng": -5.4536}'),

-- Greece
('Port of Piraeus', 'Greece', 'Athens', 'GRPIR', '{"lat": 37.9755, "lng": 23.7348}'),
('Port of Thessaloniki', 'Greece', 'Thessaloniki', 'GRSKG', '{"lat": 40.6401, "lng": 22.9444}'),

-- Turkey
('Port of Istanbul', 'Turkey', 'Istanbul', 'TRIST', '{"lat": 41.0082, "lng": 28.9784}'),
('Port of Izmir', 'Turkey', 'Izmir', 'TRIZM', '{"lat": 38.4192, "lng": 27.1287}'),

-- Singapore
('Port of Singapore', 'Singapore', 'Singapore', 'SGSIN', '{"lat": 1.3521, "lng": 103.8198}'),

-- China
('Port of Shanghai', 'China', 'Shanghai', 'CNSHA', '{"lat": 31.2304, "lng": 121.4737}'),
('Port of Shenzhen', 'China', 'Shenzhen', 'CNSZX', '{"lat": 22.5431, "lng": 114.0579}'),
('Port of Ningbo-Zhoushan', 'China', 'Ningbo', 'CNNGB', '{"lat": 29.8683, "lng": 121.5440}'),
('Port of Qingdao', 'China', 'Qingdao', 'CNTAO', '{"lat": 36.0986, "lng": 120.3719}'),
('Port of Tianjin', 'China', 'Tianjin', 'CNTSN', '{"lat": 39.3434, "lng": 117.3616}'),

-- Japan
('Port of Tokyo', 'Japan', 'Tokyo', 'JPTYO', '{"lat": 35.6762, "lng": 139.6503}'),
('Port of Yokohama', 'Japan', 'Yokohama', 'JPYOK', '{"lat": 35.4437, "lng": 139.6380}'),
('Port of Kobe', 'Japan', 'Kobe', 'JPUKB', '{"lat": 34.6901, "lng": 135.1956}'),
('Port of Osaka', 'Japan', 'Osaka', 'JPOSA', '{"lat": 34.6937, "lng": 135.5023}'),

-- South Korea
('Port of Busan', 'South Korea', 'Busan', 'KRPUS', '{"lat": 35.1796, "lng": 129.0756}'),
('Port of Incheon', 'South Korea', 'Incheon', 'KRINC', '{"lat": 37.4563, "lng": 126.7052}'),

-- Australia
('Port of Melbourne', 'Australia', 'Melbourne', 'AUMEL', '{"lat": -37.8136, "lng": 144.9631}'),
('Port of Sydney', 'Australia', 'Sydney', 'AUSYD', '{"lat": -33.8688, "lng": 151.2093}'),
('Port of Brisbane', 'Australia', 'Brisbane', 'AUBNE', '{"lat": -27.4698, "lng": 153.0251}'),
('Port of Perth', 'Australia', 'Perth', 'AUPER', '{"lat": -31.9505, "lng": 115.8605}'),

-- Canada
('Port of Vancouver', 'Canada', 'Vancouver', 'CAVAN', '{"lat": 49.2827, "lng": -123.1207}'),
('Port of Montreal', 'Canada', 'Montreal', 'CAMTR', '{"lat": 45.5017, "lng": -73.5673}'),
('Port of Halifax', 'Canada', 'Halifax', 'CAHAL', '{"lat": 44.6488, "lng": -63.5752}'),

-- Brazil
('Port of Santos', 'Brazil', 'Santos', 'BRSTS', '{"lat": -23.9618, "lng": -46.3322}'),
('Port of Rio de Janeiro', 'Brazil', 'Rio de Janeiro', 'BRRIO', '{"lat": -22.9068, "lng": -43.1729}'),

-- Argentina
('Port of Buenos Aires', 'Argentina', 'Buenos Aires', 'ARBUE', '{"lat": -34.6118, "lng": -58.3960}'),

-- Chile
('Port of Valparaiso', 'Chile', 'Valparaiso', 'CLVAP', '{"lat": -33.0458, "lng": -71.6197}'),

-- South Africa
('Port of Cape Town', 'South Africa', 'Cape Town', 'ZACPT', '{"lat": -33.9249, "lng": 18.4241}'),
('Port of Durban', 'South Africa', 'Durban', 'ZADUR', '{"lat": -29.8587, "lng": 31.0218}'),

-- India
('Port of Mumbai', 'India', 'Mumbai', 'INBOM', '{"lat": 19.0760, "lng": 72.8777}'),
('Port of Chennai', 'India', 'Chennai', 'INMAA', '{"lat": 13.0827, "lng": 80.2707}'),
('Port of Kolkata', 'India', 'Kolkata', 'INCCU', '{"lat": 22.5726, "lng": 88.3639}'),

-- Thailand
('Port of Laem Chabang', 'Thailand', 'Laem Chabang', 'THLCB', '{"lat": 13.0866, "lng": 100.8837}'),
('Port of Bangkok', 'Thailand', 'Bangkok', 'THBKK', '{"lat": 13.7563, "lng": 100.5018}'),

-- Malaysia
('Port of Klang', 'Malaysia', 'Klang', 'MYPKG', '{"lat": 3.0042, "lng": 101.3899}'),
('Port of Penang', 'Malaysia', 'Penang', 'MYPEN', '{"lat": 5.4164, "lng": 100.3327}'),

-- Indonesia
('Port of Jakarta', 'Indonesia', 'Jakarta', 'IDJKT', '{"lat": -6.2088, "lng": 106.8456}'),
('Port of Surabaya', 'Indonesia', 'Surabaya', 'IDSUB', '{"lat": -7.2575, "lng": 112.7521}'),

-- Philippines
('Port of Manila', 'Philippines', 'Manila', 'PHMNL', '{"lat": 14.5995, "lng": 120.9842}'),

-- Vietnam
('Port of Ho Chi Minh City', 'Vietnam', 'Ho Chi Minh City', 'VNSGN', '{"lat": 10.8231, "lng": 106.6297}'),
('Port of Haiphong', 'Vietnam', 'Haiphong', 'VNHPH', '{"lat": 20.8449, "lng": 106.6881}'),

-- United Arab Emirates
('Port of Dubai', 'United Arab Emirates', 'Dubai', 'AEDXB', '{"lat": 25.2048, "lng": 55.2708}'),
('Port of Abu Dhabi', 'United Arab Emirates', 'Abu Dhabi', 'AEAUH', '{"lat": 24.4539, "lng": 54.3773}'),

-- Saudi Arabia
('Port of Jeddah', 'Saudi Arabia', 'Jeddah', 'SAJED', '{"lat": 21.4858, "lng": 39.1925}'),
('Port of Dammam', 'Saudi Arabia', 'Dammam', 'SADAM', '{"lat": 26.4207, "lng": 50.0888}'),

-- Egypt
('Port of Alexandria', 'Egypt', 'Alexandria', 'EGALY', '{"lat": 31.2001, "lng": 29.9187}'),
('Port of Suez', 'Egypt', 'Suez', 'EGSUZ', '{"lat": 29.9668, "lng": 32.5498}'),

-- Russia
('Port of St. Petersburg', 'Russia', 'St. Petersburg', 'RULED', '{"lat": 59.9311, "lng": 30.3609}'),
('Port of Vladivostok', 'Russia', 'Vladivostok', 'RUVVO', '{"lat": 43.1056, "lng": 131.8735}'),

-- Norway
('Port of Oslo', 'Norway', 'Oslo', 'NOOSL', '{"lat": 59.9139, "lng": 10.7522}'),
('Port of Bergen', 'Norway', 'Bergen', 'NOBGO', '{"lat": 60.3913, "lng": 5.3221}'),

-- Sweden
('Port of Gothenburg', 'Sweden', 'Gothenburg', 'SEGOT', '{"lat": 57.7089, "lng": 11.9746}'),
('Port of Stockholm', 'Sweden', 'Stockholm', 'SESTO', '{"lat": 59.3293, "lng": 18.0686}'),

-- Denmark
('Port of Copenhagen', 'Denmark', 'Copenhagen', 'DKCPH', '{"lat": 55.6761, "lng": 12.5683}'),
('Port of Aarhus', 'Denmark', 'Aarhus', 'DKAAR', '{"lat": 56.1572, "lng": 10.2107}'),

-- Poland
('Port of Gdansk', 'Poland', 'Gdansk', 'PLGDN', '{"lat": 54.3520, "lng": 18.6466}'),
('Port of Gdynia', 'Poland', 'Gdynia', 'PLGDY', '{"lat": 54.5189, "lng": 18.5305}'),

-- Finland
('Port of Helsinki', 'Finland', 'Helsinki', 'FIHEL', '{"lat": 60.1699, "lng": 24.9384}'),
('Port of Turku', 'Finland', 'Turku', 'FITKU', '{"lat": 60.4518, "lng": 22.2666}'),

-- Estonia
('Port of Tallinn', 'Estonia', 'Tallinn', 'EETLL', '{"lat": 59.4370, "lng": 24.7536}'),

-- Latvia
('Port of Riga', 'Latvia', 'Riga', 'LVRGA', '{"lat": 56.9496, "lng": 24.1052}'),

-- Lithuania
('Port of Klaipeda', 'Lithuania', 'Klaipeda', 'LTKLJ', '{"lat": 55.7033, "lng": 21.1443}'),

-- Romania
('Port of Constanta', 'Romania', 'Constanta', 'ROCND', '{"lat": 44.1598, "lng": 28.6348}'),

-- Bulgaria
('Port of Varna', 'Bulgaria', 'Varna', 'BGVAR', '{"lat": 43.2141, "lng": 27.9147}'),

-- Ukraine
('Port of Odessa', 'Ukraine', 'Odessa', 'UAODS', '{"lat": 46.4825, "lng": 30.7233}'),

-- Morocco
('Port of Casablanca', 'Morocco', 'Casablanca', 'MACAS', '{"lat": 33.5731, "lng": -7.5898}'),

-- Algeria
('Port of Algiers', 'Algeria', 'Algiers', 'DZALG', '{"lat": 36.7538, "lng": 3.0588}'),

-- Tunisia
('Port of Tunis', 'Tunisia', 'Tunis', 'TNTUN', '{"lat": 36.8065, "lng": 10.1815}'),

-- Libya
('Port of Tripoli', 'Libya', 'Tripoli', 'LYTIP', '{"lat": 32.8872, "lng": 13.1913}'),

-- Nigeria
('Port of Lagos', 'Nigeria', 'Lagos', 'NGLOS', '{"lat": 6.5244, "lng": 3.3792}'),

-- Ghana
('Port of Tema', 'Ghana', 'Tema', 'GHTEM', '{"lat": 5.6148, "lng": -0.0153}'),

-- Kenya
('Port of Mombasa', 'Kenya', 'Mombasa', 'KEMBA', '{"lat": -4.0437, "lng": 39.6682}'),

-- Tanzania
('Port of Dar es Salaam', 'Tanzania', 'Dar es Salaam', 'TZDAR', '{"lat": -6.7924, "lng": 39.2083}'),

-- Mozambique
('Port of Maputo', 'Mozambique', 'Maputo', 'MZMPM', '{"lat": -25.9692, "lng": 32.5732}'),

-- Angola
('Port of Luanda', 'Angola', 'Luanda', 'AOLAD', '{"lat": -8.8390, "lng": 13.2894}'),

-- Namibia
('Port of Walvis Bay', 'Namibia', 'Walvis Bay', 'NAWVB', '{"lat": -22.9576, "lng": 14.5053}'),

-- Additional major ports for comprehensive coverage
('Port of Colombo', 'Sri Lanka', 'Colombo', 'LKCMB', '{"lat": 6.9271, "lng": 79.8612}'),
('Port of Karachi', 'Pakistan', 'Karachi', 'PKKHI', '{"lat": 24.8607, "lng": 67.0011}'),
('Port of Chittagong', 'Bangladesh', 'Chittagong', 'BDCGP', '{"lat": 22.3569, "lng": 91.7832}'),
('Port of Yangon', 'Myanmar', 'Yangon', 'MMRGN', '{"lat": 16.8661, "lng": 96.1951}'),
('Port of Phnom Penh', 'Cambodia', 'Phnom Penh', 'KHPNH', '{"lat": 11.5564, "lng": 104.9282}'),
('Port of Vientiane', 'Laos', 'Vientiane', 'LAVTE', '{"lat": 17.9757, "lng": 102.6331}'),
('Port of Ulaanbaatar', 'Mongolia', 'Ulaanbaatar', 'MNULN', '{"lat": 47.8864, "lng": 106.9057}'),
('Port of Almaty', 'Kazakhstan', 'Almaty', 'KZALA', '{"lat": 43.2381, "lng": 76.9450}'),
('Port of Tashkent', 'Uzbekistan', 'Tashkent', 'UZTAS', '{"lat": 41.2995, "lng": 69.2401}'),
('Port of Bishkek', 'Kyrgyzstan', 'Bishkek', 'KGBIS', '{"lat": 42.8746, "lng": 74.5698}'),
('Port of Dushanbe', 'Tajikistan', 'Dushanbe', 'TJDYU', '{"lat": 38.5598, "lng": 68.7870}'),
('Port of Ashgabat', 'Turkmenistan', 'Ashgabat', 'TMASB', '{"lat": 37.9601, "lng": 58.3261}'),
('Port of Tehran', 'Iran', 'Tehran', 'IRTHR', '{"lat": 35.6892, "lng": 51.3890}'),
('Port of Baghdad', 'Iraq', 'Baghdad', 'IQBGW', '{"lat": 33.3152, "lng": 44.3661}'),
('Port of Damascus', 'Syria', 'Damascus', 'SYDAM', '{"lat": 33.5138, "lng": 36.2765}'),
('Port of Beirut', 'Lebanon', 'Beirut', 'LBBEY', '{"lat": 33.8938, "lng": 35.5018}'),
('Port of Amman', 'Jordan', 'Amman', 'JOAMM', '{"lat": 31.9454, "lng": 35.9284}'),
('Port of Jerusalem', 'Israel', 'Jerusalem', 'ILJRS', '{"lat": 31.7683, "lng": 35.2137}'),
('Port of Tel Aviv', 'Israel', 'Tel Aviv', 'ILTLV', '{"lat": 32.0853, "lng": 34.7818}'),
('Port of Haifa', 'Israel', 'Haifa', 'ILHFA', '{"lat": 32.7940, "lng": 34.9896}'),
('Port of Ramallah', 'Palestine', 'Ramallah', 'PSRAM', '{"lat": 31.9073, "lng": 35.2011}'),
('Port of Gaza', 'Palestine', 'Gaza', 'PSGAZ', '{"lat": 31.3547, "lng": 34.3088}'),
('Port of Nicosia', 'Cyprus', 'Nicosia', 'CYNIC', '{"lat": 35.1856, "lng": 33.3823}'),
('Port of Limassol', 'Cyprus', 'Limassol', 'CYLIM', '{"lat": 34.7071, "lng": 33.0226}'),
('Port of Larnaca', 'Cyprus', 'Larnaca', 'CYLCA', '{"lat": 34.9167, "lng": 33.6333}'),
('Port of Paphos', 'Cyprus', 'Paphos', 'CYPFO', '{"lat": 34.7578, "lng": 32.4069}'),
('Port of Valletta', 'Malta', 'Valletta', 'MTMLA', '{"lat": 35.8989, "lng": 14.5146}'),
('Port of Victoria', 'Seychelles', 'Victoria', 'SCVIC', '{"lat": -4.6201, "lng": 55.4513}'),
('Port of Port Louis', 'Mauritius', 'Port Louis', 'MUPLU', '{"lat": -20.1619, "lng": 57.4989}'),
('Port of Saint-Denis', 'Reunion', 'Saint-Denis', 'REPDG', '{"lat": -20.8789, "lng": 55.4481}'),
('Port of Mamoudzou', 'Mayotte', 'Mamoudzou', 'YTMWZ', '{"lat": -12.7809, "lng": 45.2279}'),
('Port of Antananarivo', 'Madagascar', 'Antananarivo', 'MGTNR', '{"lat": -18.8792, "lng": 47.5079}'),
('Port of Moroni', 'Comoros', 'Moroni', 'KMHAH', '{"lat": -11.7172, "lng": 43.2551}'),
('Port of Djibouti', 'Djibouti', 'Djibouti', 'DJJIB', '{"lat": 11.8251, "lng": 42.5903}'),
('Port of Asmara', 'Eritrea', 'Asmara', 'ERASM', '{"lat": 15.3229, "lng": 38.9251}'),
('Port of Addis Ababa', 'Ethiopia', 'Addis Ababa', 'ETADD', '{"lat": 9.1450, "lng": 38.7667}'),
('Port of Kampala', 'Uganda', 'Kampala', 'UGKLA', '{"lat": 0.3476, "lng": 32.5825}'),
('Port of Kigali', 'Rwanda', 'Kigali', 'RWKGL', '{"lat": -1.9441, "lng": 30.0619}'),
('Port of Bujumbura', 'Burundi', 'Bujumbura', 'BIBJM', '{"lat": -3.3614, "lng": 29.3599}'),
('Port of Gitega', 'Burundi', 'Gitega', 'BIGIT', '{"lat": -3.4278, "lng": 29.9247}'),
('Port of Kinshasa', 'Democratic Republic of Congo', 'Kinshasa', 'CDFIH', '{"lat": -4.4419, 'lng': 15.2663}'),
('Port of Brazzaville', 'Republic of Congo', 'Brazzaville', 'CGBZV', '{"lat": -4.2634, "lng": 15.2429}'),
('Port of Bangui', 'Central African Republic', 'Bangui', 'CFBGF', '{"lat": 4.3947, "lng": 18.5582}'),
('Port of N''Djamena', 'Chad', 'N''Djamena', 'TDNDJ', '{"lat": 12.1348, "lng": 15.0557}'),
('Port of Yaounde', 'Cameroon', 'Yaounde', 'CMYAX', '{"lat": 3.8480, "lng": 11.5021}'),
('Port of Douala', 'Cameroon', 'Douala', 'CMDLA', '{"lat": 4.0483, "lng": 9.7043}'),
('Port of Malabo', 'Equatorial Guinea', 'Malabo', 'GQSSG', '{"lat": 3.7504, "lng": 8.7371}'),
('Port of Bata', 'Equatorial Guinea', 'Bata', 'GQBSG', '{"lat": 1.8639, "lng": 9.7658}'),
('Port of Libreville', 'Gabon', 'Libreville', 'GALBV', '{"lat": 0.4162, "lng": 9.4673}'),
('Port of Port-Gentil', 'Gabon', 'Port-Gentil', 'GAPOG', '{"lat": -0.7167, "lng": 8.7833}'),
('Port of Sao Tome', 'Sao Tome and Principe', 'Sao Tome', 'STTMS', '{"lat": 0.3365, "lng": 6.7273}'),
('Port of Bissau', 'Guinea-Bissau', 'Bissau', 'GWOXB', '{"lat": 11.8037, "lng": -15.1804}'),
('Port of Conakry', 'Guinea', 'Conakry', 'GNCKY', '{"lat": 9.6412, "lng": -13.5784}'),
('Port of Freetown', 'Sierra Leone', 'Freetown', 'SLFNA', '{"lat": 8.4840, "lng": -13.2299}'),
('Port of Monrovia', 'Liberia', 'Monrovia', 'LRMLW', '{"lat": 6.3008, "lng": -10.7970}'),
('Port of Abidjan', 'Ivory Coast', 'Abidjan', 'CIABJ', '{"lat": 5.3600, "lng": -4.0083}'),
('Port of Yamoussoukro', 'Ivory Coast', 'Yamoussoukro', 'CIASK', '{"lat": 6.8276, "lng": -5.2893}'),
('Port of Accra', 'Ghana', 'Accra', 'GHACC', '{"lat": 5.6037, "lng": -0.1870}'),
('Port of Kumasi', 'Ghana', 'Kumasi', 'GHKMS', '{"lat": 6.6885, "lng": -1.6244}'),
('Port of Tamale', 'Ghana', 'Tamale', 'GHTAM', '{"lat": 9.4008, "lng": -0.8393}'),
('Port of Ouagadougou', 'Burkina Faso', 'Ouagadougou', 'BFOUA', '{"lat": 12.3714, "lng": -1.5197}'),
('Port of Bamako', 'Mali', 'Bamako', 'MLBKO', '{"lat": 12.6392, "lng": -8.0029}'),
('Port of Niamey', 'Niger', 'Niamey', 'NENIM', '{"lat": 13.5137, "lng": 2.1098}'),
('Port of Nouakchott', 'Mauritania', 'Nouakchott', 'MRNKC', '{"lat": 18.0735, "lng": -15.9582}'),
('Port of Dakar', 'Senegal', 'Dakar', 'SNDKR', '{"lat": 14.6928, "lng": -17.4467}'),
('Port of Banjul', 'Gambia', 'Banjul', 'GMBJL', '{"lat": 13.4549, "lng": -16.5790}'),
('Port of Bissau', 'Guinea-Bissau', 'Bissau', 'GWOXB', '{"lat": 11.8037, "lng": -15.1804}'),
('Port of Conakry', 'Guinea', 'Conakry', 'GNCKY', '{"lat": 9.6412, "lng": -13.5784}'),
('Port of Freetown', 'Sierra Leone', 'Freetown', 'SLFNA', '{"lat": 8.4840, "lng": -13.2299}'),
('Port of Monrovia', 'Liberia', 'Monrovia', 'LRMLW', '{"lat": 6.3008, "lng": -10.7970}'),
('Port of Abidjan', 'Ivory Coast', 'Abidjan', 'CIABJ', '{"lat": 5.3600, "lng": -4.0083}'),
('Port of Yamoussoukro', 'Ivory Coast', 'Yamoussoukro', 'CIASK', '{"lat": 6.8276, "lng": -5.2893}'),
('Port of Accra', 'Ghana', 'Accra', 'GHACC', '{"lat": 5.6037, "lng": -0.1870}'),
('Port of Kumasi', 'Ghana', 'Kumasi', 'GHKMS', '{"lat": 6.6885, "lng": -1.6244}'),
('Port of Tamale', 'Ghana', 'Tamale', 'GHTAM', '{"lat": 9.4008, "lng": -0.8393}'),
('Port of Ouagadougou', 'Burkina Faso', 'Ouagadougou', 'BFOUA', '{"lat": 12.3714, "lng": -1.5197}'),
('Port of Bamako', 'Mali', 'Bamako', 'MLBKO', '{"lat": 12.6392, "lng": -8.0029}'),
('Port of Niamey', 'Niger', 'Niamey', 'NENIM', '{"lat": 13.5137, "lng": 2.1098}'),
('Port of Nouakchott', 'Mauritania', 'Nouakchott', 'MRNKC', '{"lat": 18.0735, "lng": -15.9582}'),
('Port of Dakar', 'Senegal', 'Dakar', 'SNDKR', '{"lat": 14.6928, "lng": -17.4467}'),
('Port of Banjul', 'Gambia', 'Banjul', 'GMBJL', '{"lat": 13.4549, "lng": -16.5790}'),
('Port of Bissau', 'Guinea-Bissau', 'Bissau', 'GWOXB', '{"lat": 11.8037, "lng": -15.1804}'),
('Port of Conakry', 'Guinea', 'Conakry', 'GNCKY', '{"lat": 9.6412, "lng": -13.5784}'),
('Port of Freetown', 'Sierra Leone', 'Freetown', 'SLFNA', '{"lat": 8.4840, "lng": -13.2299}'),
('Port of Monrovia', 'Liberia', 'Monrovia', 'LRMLW', '{"lat": 6.3008, "lng": -10.7970}'),
('Port of Abidjan', 'Ivory Coast', 'Abidjan', 'CIABJ', '{"lat": 5.3600, "lng": -4.0083}'),
('Port of Yamoussoukro', 'Ivory Coast', 'Yamoussoukro', 'CIASK', '{"lat": 6.8276, "lng": -5.2893}'),
('Port of Accra', 'Ghana', 'Accra', 'GHACC', '{"lat": 5.6037, "lng": -0.1870}'),
('Port of Kumasi', 'Ghana', 'Kumasi', 'GHKMS', '{"lat": 6.6885, "lng": -1.6244}'),
('Port of Tamale', 'Ghana', 'Tamale', 'GHTAM', '{"lat": 9.4008, "lng": -0.8393}'),
('Port of Ouagadougou', 'Burkina Faso', 'Ouagadougou', 'BFOUA', '{"lat": 12.3714, "lng": -1.5197}'),
('Port of Bamako', 'Mali', 'Bamako', 'MLBKO', '{"lat": 12.6392, "lng": -8.0029}'),
('Port of Niamey', 'Niger', 'Niamey', 'NENIM', '{"lat": 13.5137, "lng": 2.1098}'),
('Port of Nouakchott', 'Mauritania', 'Nouakchott', 'MRNKC', '{"lat": 18.0735, "lng": -15.9582}'),
('Port of Dakar', 'Senegal', 'Dakar', 'SNDKR', '{"lat": 14.6928, "lng": -17.4467}'),
('Port of Banjul', 'Gambia', 'Banjul', 'GMBJL', '{"lat": 13.4549, "lng": -16.5790}')
ON CONFLICT (code) DO NOTHING;
