-- Create ports table
CREATE TABLE IF NOT EXISTS ports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  world_port_index TEXT,
  region_name TEXT,
  main_port_name TEXT NOT NULL,
  alternate_port_name TEXT,
  un_locode TEXT,
  country_code TEXT,
  country_name TEXT,
  world_water_body TEXT,
  iho_sea_area TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  harbor_size TEXT,
  harbor_type TEXT,
  harbor_use TEXT,
  shelter_afforded TEXT,
  tidal_range DECIMAL(8, 2),
  entrance_width DECIMAL(8, 2),
  channel_depth DECIMAL(8, 2),
  anchorage_depth DECIMAL(8, 2),
  cargo_pier_depth DECIMAL(8, 2),
  max_vessel_length DECIMAL(8, 2),
  max_vessel_beam DECIMAL(8, 2),
  max_vessel_draft DECIMAL(8, 2),
  pilotage_compulsory BOOLEAN DEFAULT FALSE,
  pilotage_available BOOLEAN DEFAULT FALSE,
  tugs_assistance BOOLEAN DEFAULT FALSE,
  facilities_wharves BOOLEAN DEFAULT FALSE,
  facilities_anchorage BOOLEAN DEFAULT FALSE,
  facilities_container BOOLEAN DEFAULT FALSE,
  facilities_oil_terminal BOOLEAN DEFAULT FALSE,
  facilities_lng_terminal BOOLEAN DEFAULT FALSE,
  search_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better search performance
CREATE INDEX IF NOT EXISTS idx_ports_main_name ON ports(main_port_name);
CREATE INDEX IF NOT EXISTS idx_ports_alternate_name ON ports(alternate_port_name);
CREATE INDEX IF NOT EXISTS idx_ports_country ON ports(country_code);
CREATE INDEX IF NOT EXISTS idx_ports_region ON ports(region_name);
CREATE INDEX IF NOT EXISTS idx_ports_search_text ON ports USING gin(to_tsvector('english', search_text));
CREATE INDEX IF NOT EXISTS idx_ports_location ON ports(latitude, longitude);

-- Add homebase field to superintendent_profiles
ALTER TABLE superintendent_profiles 
ADD COLUMN IF NOT EXISTS homebase TEXT;

-- Add homebase field to users table as well for easier access
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS homebase TEXT;

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_ports_updated_at 
    BEFORE UPDATE ON ports 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Add some sample data for testing (you can remove this after importing the CSV)
INSERT INTO ports (main_port_name, country_code, region_name, latitude, longitude, search_text) VALUES
('Port of Singapore', 'SG', 'Singapore', 1.2833, 103.8333, 'port of singapore singapore sg'),
('Port of Rotterdam', 'NL', 'Netherlands', 51.9167, 4.5000, 'port of rotterdam netherlands nl'),
('Port of Hamburg', 'DE', 'Germany', 53.5500, 9.9833, 'port of hamburg germany de'),
('Port of Los Angeles', 'US', 'United States', 33.7175, -118.2725, 'port of los angeles united states us'),
('Port of Shanghai', 'CN', 'China', 31.2000, 121.5000, 'port of shanghai china cn')
ON CONFLICT DO NOTHING;
