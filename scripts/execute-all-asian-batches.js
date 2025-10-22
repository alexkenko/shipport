const fs = require('fs');
const path = require('path');

async function executeAllAsianPortBatches() {
  try {
    console.log('🚢 Starting execution of all Asian port batches...');
    
    const totalBatches = 121;
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 1; i <= totalBatches; i++) {
      const batchFileName = `sql/asian_ports_batch_${String(i).padStart(3, '0')}.sql`;
      
      try {
        if (!fs.existsSync(batchFileName)) {
          console.log(`⚠️  Batch file ${batchFileName} not found, skipping...`);
          continue;
        }
        
        const batchSql = fs.readFileSync(batchFileName, 'utf8');
        
        console.log(`📤 Executing batch ${i}/${totalBatches}...`);
        
        // Execute the batch using fetch to Supabase
        const response = await fetch(process.env.SUPABASE_REST_EXECUTE_SQL_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
            'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY
          },
          body: JSON.stringify({ query: batchSql })
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`❌ Batch ${i} failed:`, errorText);
          errorCount++;
          continue;
        }
        
        console.log(`✅ Batch ${i} completed successfully`);
        successCount++;
        
        // Small delay between batches to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Progress update every 10 batches
        if (i % 10 === 0) {
          console.log(`📊 Progress: ${i}/${totalBatches} batches completed (${successCount} success, ${errorCount} errors)`);
        }
        
      } catch (error) {
        console.error(`❌ Error in batch ${i}:`, error.message);
        errorCount++;
        continue;
      }
    }
    
    console.log('🎉 All batches completed!');
    console.log(`📊 Final results: ${successCount} successful, ${errorCount} errors out of ${totalBatches} batches`);
    
  } catch (error) {
    console.error('❌ Execution failed:', error);
  }
}

executeAllAsianPortBatches();
