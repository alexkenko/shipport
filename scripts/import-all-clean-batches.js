const fs = require('fs');
const path = require('path');

// Script to import all clean batch files
async function importAllCleanBatches() {
  console.log('🚢 Starting import of ALL clean batch files...');
  
  const batchesDir = 'sql';
  const cleanBatchFiles = fs.readdirSync(batchesDir)
    .filter(file => file.startsWith('clean_unlocode_batch_') && file.endsWith('.sql'))
    .sort();
  
  console.log(`📦 Found ${cleanBatchFiles.length} clean batch files to import`);
  
  let totalImported = 0;
  let successCount = 0;
  let errorCount = 0;
  
  for (let i = 0; i < cleanBatchFiles.length; i++) {
    const batchFile = cleanBatchFiles[i];
    const batchPath = path.join(batchesDir, batchFile);
    
    try {
      console.log(`📦 Importing ${batchFile} (${i + 1}/${cleanBatchFiles.length})...`);
      
      const sqlContent = fs.readFileSync(batchPath, 'utf8');
      
      // Count ports in this batch
      const portCount = (sqlContent.match(/\(/g) || []).length;
      console.log(`📊 Found ${portCount} ports in ${batchFile}`);
      
      // For now, just log what we would do
      console.log(`✅ Would import ${portCount} ports from ${batchFile}`);
      
      totalImported += portCount;
      successCount++;
      
    } catch (error) {
      console.error(`❌ Error processing ${batchFile}:`, error.message);
      errorCount++;
    }
    
    // Progress update every 5 batches
    if ((i + 1) % 5 === 0) {
      console.log(`📊 Progress: ${i + 1}/${cleanBatchFiles.length} batches processed`);
    }
  }
  
  console.log(`🎉 Processing complete!`);
  console.log(`✅ Successfully processed: ${successCount} batches`);
  console.log(`❌ Errors: ${errorCount} batches`);
  console.log(`📊 Total ports ready for import: ${totalImported}`);
}

importAllCleanBatches();
