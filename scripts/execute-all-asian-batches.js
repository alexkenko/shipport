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
        const response = await fetch('https://xumhixssblldxhteyakk.supabase.co/rest/v1/rpc/execute_sql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1bWhpeHNzYmxsc2R4aHRleWFrayIsInJvbGUiOiJzZXJ2aWNlX3JvbGUiLCJpYXQiOjE3MzQ4MjQ4NzQsImV4cCI6MjA1MDQwMDg3NH0.7QJ8QJ8QJ8QJ8QJ8QJ8QJ8QJ8QJ8QJ8QJ8QJ8QJ8',
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1bWhpeHNzYmxsc2R4aHRleWFrayIsInJvbGUiOiJzZXJ2aWNlX3JvbGUiLCJpYXQiOjE3MzQ4MjQ4NzQsImV4cCI6MjA1MDQwMDg3NH0.7QJ8QJ8QJ8QJ8QJ8QJ8QJ8QJ8QJ8QJ8QJ8QJ8QJ8'
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
