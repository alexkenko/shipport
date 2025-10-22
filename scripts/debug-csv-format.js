const fs = require('fs');
const path = require('path');

// Debug script to understand the CSV format
function debugCSVFormat() {
  console.log('🔍 Debugging CSV format...');
  
  const filePath = 'Listofports/2024-2 UNLOCODE CodeListPart1.csv';
  const data = fs.readFileSync(filePath, 'utf8');
  const lines = data.split('\n');
  
  console.log(`📊 Total lines: ${lines.length}`);
  
  let processedCount = 0;
  let validCount = 0;
  
  for (let i = 0; i < Math.min(100, lines.length); i++) {
    const line = lines[i].trim();
    processedCount++;
    
    if (!line || line.startsWith(',')) {
      console.log(`Line ${i}: Skipped (empty or starts with comma): "${line}"`);
      continue;
    }
    
    const columns = line.split(',');
    if (columns.length < 10) {
      console.log(`Line ${i}: Skipped (too few columns): ${columns.length} columns`);
      continue;
    }
    
    const [, countryCode, locode, name] = columns;
    
    if (!countryCode || !locode || !name) {
      console.log(`Line ${i}: Skipped (missing data): country="${countryCode}", locode="${locode}", name="${name}"`);
      continue;
    }
    
    validCount++;
    console.log(`Line ${i}: VALID - ${countryCode}${locode}: ${name}`);
    
    if (validCount >= 10) break;
  }
  
  console.log(`📊 Processed: ${processedCount}, Valid: ${validCount}`);
}

debugCSVFormat();
