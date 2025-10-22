-- Comprehensive Major Seaports Worldwide
-- Countries: China, Japan, South Korea, Singapore, USA, UK, Netherlands, Germany, France, Spain, Italy, Greece, Turkey, UAE, India, Australia, Brazil, Mexico, Canada, South Africa, Egypt, and more

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
) VALUES
-- CHINA (Major Ports)
('CN001', 'East Asia', 'Shanghai', 'Port of Shanghai', 'CNSHA', 'CN', 'China', 'Pacific Ocean', 'East China Sea', 31.2304, 121.4737, 'Large', 'Coastal (Natural)', 'Commercial', 'Excellent', 4.0, 400, 15, 18, 16, 400, 60, 16, true, true, true, true, true, true, true, false, 'shanghai port china cnsha east asia yangtze river huangpu container terminal cargo', NOW(), NOW()),
('CN002', 'East Asia', 'Ningbo', 'Port of Ningbo-Zhoushan', 'CNNGB', 'CN', 'China', 'Pacific Ocean', 'East China Sea', 29.8683, 121.5440, 'Large', 'Coastal (Natural)', 'Commercial', 'Excellent', 3.5, 350, 22, 20, 18, 400, 60, 18, true, true, true, true, true, true, true, false, 'ningbo zhoushan port china cnngb east asia container cargo bulk', NOW(), NOW()),
('CN003', 'East Asia', 'Shenzhen', 'Port of Shenzhen', 'CNSZX', 'CN', 'China', 'Pacific Ocean', 'South China Sea', 22.5431, 114.0579, 'Large', 'Coastal (Natural)', 'Commercial', 'Excellent', 2.0, 300, 16, 17, 15, 380, 58, 15, true, true, true, true, true, true, true, false, 'shenzhen port china cnszx south china sea pearl river delta container', NOW(), NOW()),
('CN004', 'East Asia', 'Guangzhou', 'Port of Guangzhou', 'CNGUO', 'CN', 'China', 'Pacific Ocean', 'South China Sea', 23.1291, 113.2644, 'Large', 'Coastal (Natural)', 'Commercial', 'Excellent', 2.5, 280, 14, 15, 14, 350, 55, 14, true, true, true, true, true, true, false, false, 'guangzhou canton port china cnguo pearl river cargo container', NOW(), NOW()),
('CN005', 'East Asia', 'Qingdao', 'Port of Qingdao', 'CNTAO', 'CN', 'China', 'Pacific Ocean', 'Yellow Sea', 36.0986, 120.3719, 'Large', 'Coastal (Natural)', 'Commercial', 'Excellent', 3.0, 300, 16, 18, 16, 360, 56, 16, true, true, true, true, true, true, true, false, 'qingdao port china cntao yellow sea shandong container cargo', NOW(), NOW()),
('CN006', 'East Asia', 'Tianjin', 'Port of Tianjin', 'CNTXG', 'CN', 'China', 'Pacific Ocean', 'Bohai Sea', 39.0298, 117.7460, 'Large', 'Coastal (Natural)', 'Commercial', 'Good', 3.5, 250, 14, 16, 14, 340, 54, 14, true, true, true, true, true, true, false, false, 'tianjin port china cntxg bohai sea beijing container cargo', NOW(), NOW()),
('CN007', 'East Asia', 'Dalian', 'Port of Dalian', 'CNDLC', 'CN', 'China', 'Pacific Ocean', 'Yellow Sea', 38.9140, 121.6147, 'Large', 'Coastal (Natural)', 'Commercial', 'Excellent', 3.0, 280, 15, 17, 15, 350, 55, 15, true, true, true, true, true, true, true, false, 'dalian port china cndlc yellow sea liaoning container cargo', NOW(), NOW()),
('CN008', 'East Asia', 'Xiamen', 'Port of Xiamen', 'CNXMN', 'CN', 'China', 'Pacific Ocean', 'Taiwan Strait', 24.4798, 118.0819, 'Large', 'Coastal (Natural)', 'Commercial', 'Excellent', 4.0, 250, 14, 16, 14, 330, 52, 14, true, true, true, true, true, true, false, false, 'xiamen amoy port china cnxmn fujian taiwan strait container', NOW(), NOW()),
('CN009', 'East Asia', 'Hong Kong', 'Port of Hong Kong', 'HKHKG', 'CN', 'China', 'Pacific Ocean', 'South China Sea', 22.3193, 114.1694, 'Large', 'Coastal (Natural)', 'Commercial', 'Excellent', 2.0, 400, 18, 20, 17, 400, 60, 17, true, true, true, true, true, true, true, false, 'hong kong port china hkhkg victoria harbour kwai chung container hub', NOW(), NOW()),

-- SINGAPORE
('SG001', 'Southeast Asia', 'Singapore', 'Port of Singapore', 'SGSIN', 'SG', 'Singapore', 'Pacific Ocean', 'Singapore Strait', 1.2644, 103.8220, 'Large', 'Coastal (Natural)', 'Commercial', 'Excellent', 2.5, 500, 20, 22, 18, 400, 62, 18, true, true, true, true, true, true, true, true, 'singapore port sgsin southeast asia keppel psa tanjong pagar container hub transshipment', NOW(), NOW()),

-- JAPAN
('JP001', 'East Asia', 'Tokyo', 'Port of Tokyo', 'JPTYO', 'JP', 'Japan', 'Pacific Ocean', 'Tokyo Bay', 35.6528, 139.7715, 'Large', 'Coastal (Natural)', 'Commercial', 'Excellent', 2.0, 350, 16, 18, 16, 370, 56, 16, true, true, true, true, true, true, false, false, 'tokyo port japan jptyo tokyo bay kanto container cargo', NOW(), NOW()),
('JP002', 'East Asia', 'Yokohama', 'Port of Yokohama', 'JPYOK', 'JP', 'Japan', 'Pacific Ocean', 'Tokyo Bay', 35.4437, 139.6380, 'Large', 'Coastal (Natural)', 'Commercial', 'Excellent', 2.0, 340, 15, 17, 15, 360, 55, 15, true, true, true, true, true, true, false, false, 'yokohama port japan jpyok tokyo bay container cargo', NOW(), NOW()),
('JP003', 'East Asia', 'Osaka', 'Port of Osaka', 'JPOSA', 'JP', 'Japan', 'Pacific Ocean', 'Osaka Bay', 34.6518, 135.4305, 'Large', 'Coastal (Natural)', 'Commercial', 'Excellent', 2.0, 320, 14, 16, 14, 350, 54, 14, true, true, true, true, true, true, false, false, 'osaka port japan jposa kansai osaka bay container cargo', NOW(), NOW()),
('JP004', 'East Asia', 'Nagoya', 'Port of Nagoya', 'JPNGO', 'JP', 'Japan', 'Pacific Ocean', 'Ise Bay', 35.0844, 136.8849, 'Large', 'Coastal (Natural)', 'Commercial', 'Excellent', 2.5, 300, 14, 16, 14, 340, 53, 14, true, true, true, true, true, true, false, false, 'nagoya port japan jpngo ise bay chubu container cargo', NOW(), NOW()),
('JP005', 'East Asia', 'Kobe', 'Port of Kobe', 'JPUKB', 'JP', 'Japan', 'Pacific Ocean', 'Osaka Bay', 34.6734, 135.1922, 'Large', 'Coastal (Natural)', 'Commercial', 'Excellent', 1.5, 300, 15, 17, 15, 350, 54, 15, true, true, true, true, true, true, false, false, 'kobe port japan jpukb kansai osaka bay container cargo', NOW(), NOW()),

-- SOUTH KOREA
('KR001', 'East Asia', 'Busan', 'Port of Busan', 'KRPUS', 'KR', 'South Korea', 'Pacific Ocean', 'Korea Strait', 35.1028, 129.0403, 'Large', 'Coastal (Natural)', 'Commercial', 'Excellent', 2.0, 400, 17, 19, 17, 400, 60, 17, true, true, true, true, true, true, true, false, 'busan pusan port south korea krpus korea strait container transshipment', NOW(), NOW()),
('KR002', 'East Asia', 'Incheon', 'Port of Incheon', 'KRINC', 'KR', 'South Korea', 'Pacific Ocean', 'Yellow Sea', 37.4563, 126.7052, 'Large', 'Coastal (Natural)', 'Commercial', 'Good', 8.0, 300, 14, 16, 14, 350, 54, 14, true, true, true, true, true, true, false, false, 'incheon port south korea krinc yellow sea seoul container cargo', NOW(), NOW()),

-- UNITED STATES
('US001', 'North America', 'Los Angeles', 'Port of Los Angeles', 'USLAX', 'US', 'United States', 'Pacific Ocean', 'San Pedro Bay', 33.7405, -118.2717, 'Large', 'Coastal (Natural)', 'Commercial', 'Excellent', 2.0, 400, 16, 18, 16, 400, 60, 16, true, true, true, true, true, true, true, true, 'los angeles port usa uslax california san pedro bay container cargo largest', NOW(), NOW()),
('US002', 'North America', 'Long Beach', 'Port of Long Beach', 'USLGB', 'US', 'United States', 'Pacific Ocean', 'San Pedro Bay', 33.7666, -118.1942, 'Large', 'Coastal (Natural)', 'Commercial', 'Excellent', 2.0, 380, 16, 18, 16, 390, 59, 16, true, true, true, true, true, true, true, false, 'long beach port usa uslgb california san pedro bay container cargo', NOW(), NOW()),
('US003', 'North America', 'New York', 'Port of New York and New Jersey', 'USNYC', 'US', 'United States', 'Atlantic Ocean', 'New York Bay', 40.6655, -74.0406, 'Large', 'Coastal (Natural)', 'Commercial', 'Excellent', 1.5, 500, 15, 17, 15, 380, 58, 15, true, true, true, true, true, true, false, false, 'new york port usa usnyc new jersey hudson river container cargo east coast', NOW(), NOW()),
('US004', 'North America', 'Savannah', 'Port of Savannah', 'USSAV', 'US', 'United States', 'Atlantic Ocean', 'Savannah River', 32.1153, -81.1467, 'Large', 'Coastal (Natural)', 'Commercial', 'Excellent', 2.5, 300, 14, 16, 14, 360, 55, 14, true, true, true, true, true, true, false, false, 'savannah port usa ussav georgia savannah river container cargo', NOW(), NOW()),
('US005', 'North America', 'Houston', 'Port of Houston', 'USHOU', 'US', 'United States', 'Gulf of Mexico', 'Galveston Bay', 29.7317, -95.2681, 'Large', 'Coastal (Natural)', 'Commercial', 'Excellent', 1.0, 350, 14, 16, 14, 370, 56, 14, true, true, true, true, true, true, true, true, 'houston port usa ushou texas gulf mexico petrochemical container cargo', NOW(), NOW()),
('US006', 'North America', 'Seattle', 'Port of Seattle', 'USSEA', 'US', 'United States', 'Pacific Ocean', 'Puget Sound', 47.6062, -122.3321, 'Large', 'Coastal (Natural)', 'Commercial', 'Excellent', 3.0, 300, 15, 17, 15, 350, 54, 15, true, true, true, true, true, true, false, false, 'seattle port usa ussea washington puget sound container cargo', NOW(), NOW()),

-- UNITED KINGDOM
('GB001', 'Western Europe', 'Felixstowe', 'Port of Felixstowe', 'GBFXT', 'GB', 'United Kingdom', 'Atlantic Ocean', 'North Sea', 51.9546, 1.3458, 'Large', 'Coastal (Natural)', 'Commercial', 'Excellent', 4.0, 400, 16, 18, 16, 400, 60, 16, true, true, true, true, true, true, false, false, 'felixstowe port uk gbfxt england north sea container cargo largest uk', NOW(), NOW()),
('GB002', 'Western Europe', 'Southampton', 'Port of Southampton', 'GBSOU', 'GB', 'United Kingdom', 'Atlantic Ocean', 'English Channel', 50.9045, -1.4042, 'Large', 'Coastal (Natural)', 'Commercial', 'Excellent', 4.0, 350, 15, 17, 15, 380, 58, 15, true, true, true, true, true, true, false, false, 'southampton port uk gbsou england solent container cruise cargo', NOW(), NOW()),
('GB003', 'Western Europe', 'London Gateway', 'London Gateway Port', 'GBLGP', 'GB', 'United Kingdom', 'Atlantic Ocean', 'Thames Estuary', 51.5011, 0.5621, 'Large', 'Coastal (Natural)', 'Commercial', 'Excellent', 5.0, 400, 16, 18, 16, 400, 60, 16, true, true, true, true, true, true, false, false, 'london gateway port uk gblgp thames estuary container cargo', NOW(), NOW()),

-- NETHERLANDS
('NL001', 'Western Europe', 'Rotterdam', 'Port of Rotterdam', 'NLRTM', 'NL', 'Netherlands', 'Atlantic Ocean', 'North Sea', 51.9244, 4.4777, 'Large', 'Coastal (Natural)', 'Commercial', 'Excellent', 2.0, 500, 22, 24, 20, 400, 62, 20, true, true, true, true, true, true, true, true, 'rotterdam port netherlands nlrtm europoort maasvlakte container cargo largest europe', NOW(), NOW()),
('NL002', 'Western Europe', 'Amsterdam', 'Port of Amsterdam', 'NLAMS', 'NL', 'Netherlands', 'Atlantic Ocean', 'North Sea', 52.3676, 4.9041, 'Large', 'Coastal (Natural)', 'Commercial', 'Excellent', 2.0, 350, 14, 16, 14, 360, 55, 14, true, true, true, true, true, true, false, false, 'amsterdam port netherlands nlams ijmuiden north sea container cargo', NOW(), NOW()),

-- GERMANY
('DE001', 'Western Europe', 'Hamburg', 'Port of Hamburg', 'DEHAM', 'DE', 'Germany', 'Atlantic Ocean', 'North Sea', 53.5459, 9.9716, 'Large', 'Coastal (Natural)', 'Commercial', 'Excellent', 3.5, 400, 15, 17, 15, 400, 60, 15, true, true, true, true, true, true, false, false, 'hamburg port germany deham elbe river north sea container cargo largest germany', NOW(), NOW()),
('DE002', 'Western Europe', 'Bremerhaven', 'Port of Bremerhaven', 'DEBRV', 'DE', 'Germany', 'Atlantic Ocean', 'North Sea', 53.5395, 8.5809, 'Large', 'Coastal (Natural)', 'Commercial', 'Excellent', 3.8, 350, 14, 16, 14, 380, 58, 14, true, true, true, true, true, true, false, false, 'bremerhaven port germany debrv weser river north sea container cargo', NOW(), NOW()),

-- FRANCE
('FR001', 'Western Europe', 'Le Havre', 'Port of Le Havre', 'FRLEH', 'FR', 'France', 'Atlantic Ocean', 'English Channel', 49.4833, 0.1167, 'Large', 'Coastal (Natural)', 'Commercial', 'Excellent', 7.0, 350, 15, 17, 15, 380, 58, 15, true, true, true, true, true, true, false, false, 'le havre port france frleh seine river english channel container cargo largest france', NOW(), NOW()),
('FR002', 'Western Europe', 'Marseille', 'Port of Marseille', 'FRMRS', 'FR', 'France', 'Mediterranean Sea', 'Gulf of Lion', 43.3631, 5.3492, 'Large', 'Coastal (Natural)', 'Commercial', 'Excellent', 0.5, 300, 14, 16, 14, 360, 55, 14, true, true, true, true, true, true, false, false, 'marseille port france frmrs mediterranean sea container cargo', NOW(), NOW()),

-- SPAIN
('ES001', 'Southern Europe', 'Valencia', 'Port of Valencia', 'ESVLC', 'ES', 'Spain', 'Mediterranean Sea', 'Balearic Sea', 39.4699, -0.3763, 'Large', 'Coastal (Natural)', 'Commercial', 'Excellent', 0.5, 350, 14, 16, 14, 370, 56, 14, true, true, true, true, true, true, false, false, 'valencia port spain esvlc mediterranean sea container cargo largest spain', NOW(), NOW()),
('ES002', 'Southern Europe', 'Barcelona', 'Port of Barcelona', 'ESBCN', 'ES', 'Spain', 'Mediterranean Sea', 'Balearic Sea', 41.3487, 2.1754, 'Large', 'Coastal (Natural)', 'Commercial', 'Excellent', 0.3, 320, 14, 16, 14, 360, 55, 14, true, true, true, true, true, true, false, false, 'barcelona port spain esbcn mediterranean sea container cargo cruise', NOW(), NOW()),
('ES003', 'Southern Europe', 'Algeciras', 'Port of Algeciras', 'ESALG', 'ES', 'Spain', 'Atlantic Ocean', 'Strait of Gibraltar', 36.1277, -5.4331, 'Large', 'Coastal (Natural)', 'Commercial', 'Excellent', 1.0, 400, 16, 18, 16, 400, 60, 16, true, true, true, true, true, true, false, false, 'algeciras port spain esalg gibraltar strait container transshipment', NOW(), NOW()),

-- ITALY
('IT001', 'Southern Europe', 'Genoa', 'Port of Genoa', 'ITGOA', 'IT', 'Italy', 'Mediterranean Sea', 'Ligurian Sea', 44.4056, 8.9463, 'Large', 'Coastal (Natural)', 'Commercial', 'Excellent', 0.5, 300, 14, 16, 14, 350, 54, 14, true, true, true, true, true, true, false, false, 'genoa genova port italy itgoa ligurian sea container cargo largest italy', NOW(), NOW()),
('IT002', 'Southern Europe', 'Gioia Tauro', 'Port of Gioia Tauro', 'ITGIT', 'IT', 'Italy', 'Mediterranean Sea', 'Tyrrhenian Sea', 38.4333, 15.9000, 'Large', 'Coastal (Natural)', 'Commercial', 'Excellent', 0.3, 350, 16, 18, 16, 380, 58, 16, true, true, true, true, true, true, false, false, 'gioia tauro port italy itgit calabria container transshipment', NOW(), NOW()),

-- GREECE
('GR001', 'Southern Europe', 'Piraeus', 'Port of Piraeus', 'GRPIR', 'GR', 'Greece', 'Mediterranean Sea', 'Aegean Sea', 37.9483, 23.6458, 'Large', 'Coastal (Natural)', 'Commercial', 'Excellent', 0.5, 300, 14, 16, 14, 360, 55, 14, true, true, true, true, true, true, false, false, 'piraeus athens port greece grpir aegean sea container cargo largest greece', NOW(), NOW()),

-- TURKEY
('TR001', 'Middle East', 'Istanbul', 'Port of Istanbul', 'TRIST', 'TR', 'Turkey', 'Black Sea', 'Bosphorus', 41.0082, 28.9784, 'Large', 'Coastal (Natural)', 'Commercial', 'Good', 0.3, 250, 12, 14, 12, 320, 50, 12, true, true, true, true, true, true, false, false, 'istanbul port turkey trist bosphorus marmara sea container cargo', NOW(), NOW()),
('TR002', 'Middle East', 'Izmir', 'Port of Izmir', 'TRIZM', 'TR', 'Turkey', 'Mediterranean Sea', 'Aegean Sea', 38.4192, 27.1289, 'Large', 'Coastal (Natural)', 'Commercial', 'Excellent', 0.5, 280, 13, 15, 13, 340, 52, 13, true, true, true, true, true, true, false, false, 'izmir smyrna port turkey trizm aegean sea container cargo', NOW(), NOW()),

-- UNITED ARAB EMIRATES
('AE001', 'Middle East', 'Jebel Ali', 'Port of Jebel Ali', 'AEJEA', 'AE', 'United Arab Emirates', 'Indian Ocean', 'Persian Gulf', 25.0121, 55.0614, 'Large', 'Coastal (Natural)', 'Commercial', 'Excellent', 2.0, 450, 18, 20, 17, 400, 62, 17, true, true, true, true, true, true, true, false, 'jebel ali dubai port uae aejea persian gulf container transshipment largest middle east', NOW(), NOW()),
('AE002', 'Middle East', 'Abu Dhabi', 'Port of Abu Dhabi', 'AEAUH', 'AE', 'United Arab Emirates', 'Indian Ocean', 'Persian Gulf', 24.5247, 54.3807, 'Large', 'Coastal (Natural)', 'Commercial', 'Excellent', 2.0, 350, 15, 17, 15, 370, 56, 15, true, true, true, true, true, true, true, false, 'abu dhabi port uae aeauh persian gulf container cargo oil', NOW(), NOW()),

-- INDIA
('IN001', 'South Asia', 'Mumbai', 'Port of Mumbai', 'INBOM', 'IN', 'India', 'Indian Ocean', 'Arabian Sea', 18.9387, 72.8355, 'Large', 'Coastal (Natural)', 'Commercial', 'Excellent', 3.5, 350, 14, 16, 14, 360, 55, 14, true, true, true, true, true, true, false, false, 'mumbai bombay port india inbom arabian sea container cargo largest india', NOW(), NOW()),
('IN002', 'South Asia', 'Chennai', 'Port of Chennai', 'INMAA', 'IN', 'India', 'Indian Ocean', 'Bay of Bengal', 13.0827, 80.2707, 'Large', 'Coastal (Natural)', 'Commercial', 'Excellent', 1.0, 300, 14, 16, 14, 350, 54, 14, true, true, true, true, true, true, false, false, 'chennai madras port india inmaa bay bengal container cargo', NOW(), NOW()),
('IN003', 'South Asia', 'Kolkata', 'Port of Kolkata', 'INCCU', 'IN', 'India', 'Indian Ocean', 'Bay of Bengal', 22.5726, 88.3639, 'Large', 'Coastal (Natural)', 'Commercial', 'Good', 5.0, 250, 10, 12, 10, 300, 48, 10, true, true, true, true, true, true, false, false, 'kolkata calcutta port india inccu hooghly river bay bengal container cargo', NOW(), NOW()),

-- AUSTRALIA
('AU001', 'Oceania', 'Melbourne', 'Port of Melbourne', 'AUMEL', 'AU', 'Australia', 'Pacific Ocean', 'Bass Strait', -37.8283, 144.9316, 'Large', 'Coastal (Natural)', 'Commercial', 'Excellent', 2.0, 350, 14, 16, 14, 370, 56, 14, true, true, true, true, true, true, false, false, 'melbourne port australia aumel victoria bass strait container cargo largest australia', NOW(), NOW()),
('AU002', 'Oceania', 'Sydney', 'Port of Sydney', 'AUSYD', 'AU', 'Australia', 'Pacific Ocean', 'Tasman Sea', -33.8688, 151.2093, 'Large', 'Coastal (Natural)', 'Commercial', 'Excellent', 1.5, 300, 14, 16, 14, 350, 54, 14, true, true, true, true, true, true, false, false, 'sydney port botany australia ausyd new south wales tasman sea container cargo', NOW(), NOW()),

-- BRAZIL
('BR001', 'South America', 'Santos', 'Port of Santos', 'BRSSZ', 'BR', 'Brazil', 'Atlantic Ocean', 'South Atlantic', -23.9601, -46.3333, 'Large', 'Coastal (Natural)', 'Commercial', 'Excellent', 1.2, 350, 15, 17, 15, 370, 56, 15, true, true, true, true, true, true, false, false, 'santos port brazil brssz sao paulo atlantic ocean container cargo largest latin america', NOW(), NOW()),
('BR002', 'South America', 'Rio de Janeiro', 'Port of Rio de Janeiro', 'BRRIO', 'BR', 'Brazil', 'Atlantic Ocean', 'South Atlantic', -22.9068, -43.1729, 'Large', 'Coastal (Natural)', 'Commercial', 'Excellent', 1.0, 300, 14, 16, 14, 350, 54, 14, true, true, true, true, true, true, false, false, 'rio de janeiro port brazil brrio guanabara bay container cargo', NOW(), NOW()),

-- CANADA
('CA001', 'North America', 'Vancouver', 'Port of Vancouver', 'CAVAN', 'CA', 'Canada', 'Pacific Ocean', 'Strait of Georgia', 49.2827, -123.1207, 'Large', 'Coastal (Natural)', 'Commercial', 'Excellent', 3.5, 400, 16, 18, 16, 400, 60, 16, true, true, true, true, true, true, false, false, 'vancouver port canada cavan british columbia strait georgia container cargo largest canada', NOW(), NOW()),
('CA002', 'North America', 'Montreal', 'Port of Montreal', 'CAMTR', 'CA', 'Canada', 'Atlantic Ocean', 'St. Lawrence River', 45.5017, -73.5673, 'Large', 'Coastal (Natural)', 'Commercial', 'Good', 2.0, 300, 12, 14, 12, 350, 52, 12, true, true, true, true, true, true, false, false, 'montreal port canada camtr st lawrence river container cargo', NOW(), NOW()),

-- SOUTH AFRICA
('ZA001', 'Africa', 'Durban', 'Port of Durban', 'ZADUR', 'ZA', 'South Africa', 'Indian Ocean', 'South Indian Ocean', -29.8587, 31.0218, 'Large', 'Coastal (Natural)', 'Commercial', 'Excellent', 2.0, 350, 14, 16, 14, 370, 56, 14, true, true, true, true, true, true, false, false, 'durban port south africa zadur indian ocean container cargo largest south africa', NOW(), NOW()),
('ZA002', 'Africa', 'Cape Town', 'Port of Cape Town', 'ZACPT', 'ZA', 'South Africa', 'Atlantic Ocean', 'South Atlantic', -33.9249, 18.4241, 'Large', 'Coastal (Natural)', 'Commercial', 'Excellent', 1.5, 300, 14, 16, 14, 350, 54, 14, true, true, true, true, true, true, false, false, 'cape town port south africa zacpt table bay atlantic ocean container cargo', NOW(), NOW()),

-- EGYPT
('EG001', 'Africa', 'Port Said', 'Port of Port Said', 'EGPSD', 'EG', 'Egypt', 'Mediterranean Sea', 'Eastern Mediterranean', 31.2653, 32.3019, 'Large', 'Coastal (Natural)', 'Commercial', 'Excellent', 0.5, 350, 16, 18, 16, 380, 58, 16, true, true, true, true, true, true, false, false, 'port said egypt egpsd suez canal mediterranean container cargo', NOW(), NOW()),
('EG002', 'Africa', 'Alexandria', 'Port of Alexandria', 'EGALY', 'EG', 'Egypt', 'Mediterranean Sea', 'Eastern Mediterranean', 31.2001, 29.9187, 'Large', 'Coastal (Natural)', 'Commercial', 'Excellent', 0.5, 320, 14, 16, 14, 360, 55, 14, true, true, true, true, true, true, false, false, 'alexandria port egypt egaly mediterranean sea container cargo', NOW(), NOW()),

-- MEXICO
('MX001', 'North America', 'Veracruz', 'Port of Veracruz', 'MXVER', 'MX', 'Mexico', 'Gulf of Mexico', 'Gulf of Mexico', 19.2006, -96.1386, 'Large', 'Coastal (Natural)', 'Commercial', 'Excellent', 0.5, 300, 12, 14, 12, 340, 52, 12, true, true, true, true, true, true, false, false, 'veracruz port mexico mxver gulf mexico container cargo', NOW(), NOW()),
('MX002', 'North America', 'Manzanillo', 'Port of Manzanillo', 'MXZLO', 'MX', 'Mexico', 'Pacific Ocean', 'East Pacific', 19.0534, -104.3135, 'Large', 'Coastal (Natural)', 'Commercial', 'Excellent', 1.0, 320, 14, 16, 14, 350, 54, 14, true, true, true, true, true, true, false, false, 'manzanillo port mexico mxzlo pacific ocean container cargo largest mexico', NOW(), NOW()),

-- PHILIPPINES
('PH001', 'Southeast Asia', 'Manila', 'Port of Manila', 'PHMNL', 'PH', 'Philippines', 'Pacific Ocean', 'Manila Bay', 14.5995, 120.9842, 'Large', 'Coastal (Natural)', 'Commercial', 'Good', 1.5, 280, 12, 14, 12, 330, 50, 12, true, true, true, true, true, true, false, false, 'manila port philippines phmnl manila bay luzon container cargo', NOW(), NOW()),

-- MALAYSIA  
('MY001', 'Southeast Asia', 'Port Klang', 'Port Klang', 'MYPKG', 'MY', 'Malaysia', 'Indian Ocean', 'Strait of Malacca', 3.0044, 101.3615, 'Large', 'Coastal (Natural)', 'Commercial', 'Excellent', 4.0, 350, 15, 17, 15, 370, 56, 15, true, true, true, true, true, true, false, false, 'port klang malaysia mypkg kuala lumpur strait malacca container cargo largest malaysia', NOW(), NOW()),

-- INDONESIA
('ID001', 'Southeast Asia', 'Jakarta', 'Port of Tanjung Priok', 'IDJKT', 'ID', 'Indonesia', 'Pacific Ocean', 'Java Sea', -6.1045, 106.8857, 'Large', 'Coastal (Natural)', 'Commercial', 'Good', 1.5, 300, 12, 14, 12, 340, 52, 12, true, true, true, true, true, true, false, false, 'jakarta tanjung priok port indonesia idjkt java sea container cargo', NOW(), NOW()),

-- BELGIUM
('BE001', 'Western Europe', 'Antwerp', 'Port of Antwerp', 'BEANR', 'BE', 'Belgium', 'Atlantic Ocean', 'North Sea', 51.2194, 4.4025, 'Large', 'Coastal (Natural)', 'Commercial', 'Excellent', 5.0, 400, 16, 18, 16, 400, 60, 16, true, true, true, true, true, true, false, false, 'antwerp antwerpen port belgium beanr scheldt river north sea container cargo', NOW(), NOW()),

-- POLAND
('PL001', 'Eastern Europe', 'Gdansk', 'Port of Gdansk', 'PLGDN', 'PL', 'Poland', 'Baltic Sea', 'Gulf of Gdansk', 54.3520, 18.6466, 'Large', 'Coastal (Natural)', 'Commercial', 'Excellent', 0.5, 300, 14, 16, 14, 360, 55, 14, true, true, true, true, true, true, false, false, 'gdansk danzig port poland plgdn baltic sea container cargo', NOW(), NOW()),

-- RUSSIA
('RU001', 'Eastern Europe', 'St. Petersburg', 'Port of St. Petersburg', 'RULED', 'RU', 'Russia', 'Baltic Sea', 'Gulf of Finland', 59.9343, 30.3351, 'Large', 'Coastal (Natural)', 'Commercial', 'Good', 0.3, 250, 12, 14, 12, 320, 50, 12, true, true, true, true, true, true, false, false, 'st petersburg leningrad port russia ruled baltic sea gulf finland container cargo', NOW(), NOW()),

-- THAILAND
('TH001', 'Southeast Asia', 'Bangkok', 'Port of Bangkok', 'THBKK', 'TH', 'Thailand', 'Pacific Ocean', 'Gulf of Thailand', 13.7563, 100.5018, 'Large', 'Coastal (Natural)', 'Commercial', 'Good', 3.0, 250, 10, 12, 10, 300, 48, 10, true, true, true, true, true, true, false, false, 'bangkok port thailand thbkk chao phraya river gulf thailand container cargo', NOW(), NOW()),

-- VIETNAM
('VN001', 'Southeast Asia', 'Ho Chi Minh City', 'Port of Saigon', 'VNSGN', 'VN', 'Vietnam', 'Pacific Ocean', 'South China Sea', 10.7769, 106.7009, 'Large', 'Coastal (Natural)', 'Commercial', 'Good', 3.5, 250, 12, 14, 12, 320, 50, 12, true, true, true, true, true, true, false, false, 'ho chi minh city saigon port vietnam vnsgn south china sea container cargo', NOW(), NOW()),

-- ARGENTINA
('AR001', 'South America', 'Buenos Aires', 'Port of Buenos Aires', 'ARBUE', 'AR', 'Argentina', 'Atlantic Ocean', 'Rio de la Plata', -34.6037, -58.3816, 'Large', 'Coastal (Natural)', 'Commercial', 'Good', 1.0, 250, 10, 12, 10, 300, 48, 10, true, true, true, true, true, true, false, false, 'buenos aires port argentina arbue rio de la plata container cargo', NOW(), NOW()),

-- CHILE
('CL001', 'South America', 'Valparaiso', 'Port of Valparaiso', 'CLVAP', 'CL', 'Chile', 'Pacific Ocean', 'South Pacific', -33.0472, -71.6127, 'Large', 'Coastal (Natural)', 'Commercial', 'Excellent', 1.5, 300, 14, 16, 14, 350, 54, 14, true, true, true, true, true, true, false, false, 'valparaiso port chile clvap pacific ocean container cargo', NOW(), NOW()),

-- MOROCCO
('MA001', 'Africa', 'Tangier Med', 'Port of Tangier Med', 'MATNG', 'MA', 'Morocco', 'Mediterranean Sea', 'Strait of Gibraltar', 35.8746, -5.4691, 'Large', 'Coastal (Natural)', 'Commercial', 'Excellent', 1.0, 400, 18, 20, 17, 400, 62, 17, true, true, true, true, true, true, false, false, 'tangier med port morocco matng strait gibraltar container transshipment hub africa', NOW(), NOW()),

-- SAUDI ARABIA
('SA001', 'Middle East', 'Jeddah', 'Port of Jeddah', 'SAJED', 'SA', 'Saudi Arabia', 'Red Sea', 'Red Sea', 21.4858, 39.1925, 'Large', 'Coastal (Natural)', 'Commercial', 'Excellent', 0.6, 320, 16, 18, 16, 370, 56, 16, true, true, true, true, true, true, true, false, 'jeddah jiddah port saudi arabia sajed red sea container cargo oil gateway mecca', NOW(), NOW()),

-- OMAN
('OM001', 'Middle East', 'Salalah', 'Port of Salalah', 'OMSLL', 'OM', 'Oman', 'Indian Ocean', 'Arabian Sea', 16.9333, 54.0000, 'Large', 'Coastal (Natural)', 'Commercial', 'Excellent', 2.0, 350, 16, 18, 16, 380, 58, 16, true, true, true, true, true, true, false, false, 'salalah port oman omsll arabian sea container transshipment hub', NOW(), NOW()),

-- DENMARK
('DK001', 'Northern Europe', 'Copenhagen', 'Port of Copenhagen', 'DKCPH', 'DK', 'Denmark', 'Baltic Sea', 'Oresund', 55.6761, 12.5683, 'Large', 'Coastal (Natural)', 'Commercial', 'Excellent', 0.3, 300, 12, 14, 12, 340, 52, 12, true, true, true, true, true, true, false, false, 'copenhagen kobenhavn port denmark dkcph oresund baltic sea container cargo', NOW(), NOW()),

-- SWEDEN
('SE001', 'Northern Europe', 'Gothenburg', 'Port of Gothenburg', 'SEGOT', 'SE', 'Sweden', 'Atlantic Ocean', 'Kattegat', 57.7089, 11.9746, 'Large', 'Coastal (Natural)', 'Commercial', 'Excellent', 0.3, 300, 13, 15, 13, 350, 54, 13, true, true, true, true, true, true, false, false, 'gothenburg goteborg port sweden segot kattegat north sea container cargo largest scandinavia', NOW(), NOW()),

-- NORWAY
('NO001', 'Northern Europe', 'Oslo', 'Port of Oslo', 'NOOSL', 'NO', 'Norway', 'Atlantic Ocean', 'Oslo Fjord', 59.9139, 10.7522, 'Large', 'Coastal (Natural)', 'Commercial', 'Good', 0.5, 250, 12, 14, 12, 320, 50, 12, true, true, true, true, true, true, false, false, 'oslo port norway noosl oslo fjord container cargo', NOW(), NOW()),

-- FINLAND  
('FI001', 'Northern Europe', 'Helsinki', 'Port of Helsinki', 'FIHEL', 'FI', 'Finland', 'Baltic Sea', 'Gulf of Finland', 60.1699, 24.9384, 'Large', 'Coastal (Natural)', 'Commercial', 'Good', 0.2, 250, 11, 13, 11, 310, 48, 11, true, true, true, true, true, true, false, false, 'helsinki port finland fihel gulf finland baltic sea container cargo', NOW(), NOW()),

-- PORTUGAL
('PT001', 'Southern Europe', 'Lisbon', 'Port of Lisbon', 'PTLIS', 'PT', 'Portugal', 'Atlantic Ocean', 'North Atlantic', 38.7223, -9.1393, 'Large', 'Coastal (Natural)', 'Commercial', 'Excellent', 3.5, 300, 14, 16, 14, 360, 55, 14, true, true, true, true, true, true, false, false, 'lisbon lisboa port portugal ptlis tagus river atlantic ocean container cruise cargo', NOW(), NOW()),

-- IRELAND
('IE001', 'Western Europe', 'Dublin', 'Port of Dublin', 'IEDUB', 'IE', 'Ireland', 'Atlantic Ocean', 'Irish Sea', 53.3498, -6.2603, 'Large', 'Coastal (Natural)', 'Commercial', 'Excellent', 4.0, 280, 12, 14, 12, 330, 50, 12, true, true, true, true, true, true, false, false, 'dublin port ireland iedub irish sea liffey river container cargo', NOW(), NOW()),

-- TAIWAN
('TW001', 'East Asia', 'Kaohsiung', 'Port of Kaohsiung', 'TWKHH', 'TW', 'Taiwan', 'Pacific Ocean', 'Taiwan Strait', 22.6273, 120.3014, 'Large', 'Coastal (Natural)', 'Commercial', 'Excellent', 2.0, 400, 16, 18, 16, 400, 60, 16, true, true, true, true, true, true, false, false, 'kaohsiung port taiwan twkhh taiwan strait south china sea container cargo largest taiwan', NOW(), NOW()),

-- ISRAEL
('IL001', 'Middle East', 'Haifa', 'Port of Haifa', 'ILHFA', 'IL', 'Israel', 'Mediterranean Sea', 'Eastern Mediterranean', 32.8211, 34.9983, 'Large', 'Coastal (Natural)', 'Commercial', 'Excellent', 0.5, 300, 14, 16, 14, 350, 54, 14, true, true, true, true, true, true, false, false, 'haifa port israel ilhfa mediterranean sea container cargo', NOW(), NOW()),

-- COLOMBIA
('CO001', 'South America', 'Cartagena', 'Port of Cartagena', 'COCTG', 'CO', 'Colombia', 'Caribbean Sea', 'Caribbean Sea', 10.3910, -75.5233, 'Large', 'Coastal (Natural)', 'Commercial', 'Excellent', 0.5, 300, 14, 16, 14, 350, 54, 14, true, true, true, true, true, true, false, false, 'cartagena port colombia coctg caribbean sea container cargo largest colombia', NOW(), NOW()),

-- PANAMA
('PA001', 'Central America', 'Colon', 'Port of Colon', 'PACOL', 'PA', 'Panama', 'Caribbean Sea', 'Caribbean Sea', 9.3554, -79.9009, 'Large', 'Coastal (Natural)', 'Commercial', 'Excellent', 0.3, 350, 15, 17, 15, 370, 56, 15, true, true, true, true, true, true, false, false, 'colon port panama pacol panama canal caribbean sea container transshipment', NOW(), NOW()),

-- NEW ZEALAND
('NZ001', 'Oceania', 'Auckland', 'Port of Auckland', 'NZAKL', 'NZ', 'New Zealand', 'Pacific Ocean', 'Hauraki Gulf', -36.8485, 174.7633, 'Large', 'Coastal (Natural)', 'Commercial', 'Excellent', 3.0, 280, 13, 15, 13, 340, 52, 13, true, true, true, true, true, true, false, false, 'auckland port new zealand nzakl hauraki gulf waitemata harbour container cargo', NOW(), NOW());
