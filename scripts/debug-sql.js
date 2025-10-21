const fs = require('fs');

console.log('🔍 Debugging SQL file structure...');

const sqlContent = fs.readFileSync('sql/batched_geonames_ports.sql', 'utf8');

console.log('📏 File length:', sqlContent.length);
console.log('🔍 First 500 characters:');
console.log(sqlContent.substring(0, 500));
console.log('\n🔍 Looking for VALUES...');

const valuesMatch = sqlContent.match(/VALUES\s+([\s\S]+?);\s*$/m);
if (valuesMatch) {
  console.log('✅ Found VALUES section!');
  console.log('📏 VALUES length:', valuesMatch[1].length);
  console.log('🔍 First 200 chars of VALUES:');
  console.log(valuesMatch[1].substring(0, 200));
} else {
  console.log('❌ No VALUES found');
  
  // Try different patterns
  console.log('\n🔍 Trying different patterns...');
  
  const pattern1 = /VALUES\s+(.+)/s;
  const match1 = sqlContent.match(pattern1);
  console.log('Pattern 1 (VALUES\\s+(.+)/s):', match1 ? 'Found' : 'Not found');
  
  const pattern2 = /VALUES\s+([^;]+)/;
  const match2 = sqlContent.match(pattern2);
  console.log('Pattern 2 (VALUES\\s+([^;]+)):', match2 ? 'Found' : 'Not found');
  
  const pattern3 = /VALUES\s+([\s\S]+)/;
  const match3 = sqlContent.match(pattern3);
  console.log('Pattern 3 (VALUES\\s+([\\s\\S]+)):', match3 ? 'Found' : 'Not found');
  
  // Check if VALUES exists at all
  const hasValues = sqlContent.includes('VALUES');
  console.log('Contains VALUES:', hasValues);
  
  if (hasValues) {
    const valuesIndex = sqlContent.indexOf('VALUES');
    console.log('VALUES position:', valuesIndex);
    console.log('Text around VALUES:');
    console.log(sqlContent.substring(valuesIndex - 50, valuesIndex + 100));
  }
}
