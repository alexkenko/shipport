const fs = require('fs');
const csv = require('csv-parser');
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function importPorts() {
  const ports = [];
  
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
          country_name: row['Country Code'] || null, // We'll need to map this
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
          search_text: `${row['Main Port Name'] || ''} ${row['Alternate Port Name'] || ''} ${row['Region Name'] || ''} ${row['Country Code'] || ''}`.toLowerCase().trim()
        };
        
        ports.push(port);
      })
      .on('end', async () => {
        try {
          console.log(`Importing ${ports.length} ports...`);
          
          // Clear existing ports
          const { error: deleteError } = await supabase
            .from('ports')
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
          
          if (deleteError) {
            console.error('Error clearing ports:', deleteError);
            reject(deleteError);
            return;
          }
          
          // Insert ports in batches
          const batchSize = 1000;
          for (let i = 0; i < ports.length; i += batchSize) {
            const batch = ports.slice(i, i + batchSize);
            const { error } = await supabase
              .from('ports')
              .insert(batch);
            
            if (error) {
              console.error(`Error inserting batch ${i}-${i + batchSize}:`, error);
              reject(error);
              return;
            }
            
            console.log(`Inserted batch ${i}-${i + batchSize}`);
          }
          
          console.log('Ports imported successfully!');
          resolve();
        } catch (error) {
          console.error('Error during import:', error);
          reject(error);
        }
      })
      .on('error', (error) => {
        console.error('Error reading CSV:', error);
        reject(error);
      });
  });
}

// Run the import
importPorts()
  .then(() => {
    console.log('Import completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Import failed:', error);
    process.exit(1);
  });
