const fs = require('fs');

// Debug script to understand why only 603 lines are processed
function debugProcessing() {
  console.log('🔍 Debugging processing logic...');
  
  const filePath = 'Listofports/2024-2 UNLOCODE CodeListPart1.csv';
  const data = fs.readFileSync(filePath, 'utf8');
  const lines = data.split('\n');
  
  console.log(`📊 Total lines: ${lines.length}`);
  
  let processedCount = 0;
  let validCount = 0;
  let skippedCount = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    processedCount++;
    
    if (!line) {
      skippedCount++;
      continue;
    }
    
    const columns = line.split(',');
    if (columns.length < 10) {
      skippedCount++;
      continue;
    }
    
    const [, countryCode, locode, name] = columns;
    
    if (!countryCode || !locode || !name) {
      skippedCount++;
      continue;
    }
    
    validCount++;
    
    if (validCount <= 5) {
      console.log(`Line ${i}: VALID - ${countryCode}${locode}: ${name}`);
    }
    
    if (processedCount % 10000 === 0) {
      console.log(`📊 Processed: ${processedCount}, Valid: ${validCount}, Skipped: ${skippedCount}`);
    }
  }
  
  console.log(`📊 Final - Processed: ${processedCount}, Valid: ${validCount}, Skipped: ${skippedCount}`);
}

debugProcessing();
