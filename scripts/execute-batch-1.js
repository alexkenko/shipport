const fs = require('fs');

async function executeBatchFile(batchNumber) {
  try {
    const filename = `sql/ports_batch_${String(batchNumber).padStart(3, '0')}.sql`;
    console.log(`📖 Reading ${filename}...`);
    
    const sql = fs.readFileSync(filename, 'utf8');
    
    // Extract just the INSERT part (remove DELETE)
    const insertPart = sql.split('DELETE FROM ports;')[1].trim();
    
    console.log(`📊 Executing batch ${batchNumber}...`);
    console.log(`SQL length: ${insertPart.length} characters`);
    
    return insertPart;
  } catch (error) {
    console.error(`❌ Error reading batch ${batchNumber}:`, error);
    return null;
  }
}

// Execute first batch
executeBatchFile(1).then(sql => {
  if (sql) {
    console.log('✅ Batch 1 SQL ready for execution');
    console.log('First 200 chars:', sql.substring(0, 200));
  }
});
