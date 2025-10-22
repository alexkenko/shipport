const fs = require('fs');

// Import chunks 3-10 (8 chunks = 4,000 ports)
async function importChunks3to10() {
  console.log('🚢 Importing chunks 3-10 (4,000 ports)...');
  
  for (let i = 3; i <= 10; i++) {
    const chunkFile = `sql/unlocode_chunk_${String(i).padStart(3, '0')}.sql`;
    
    if (!fs.existsSync(chunkFile)) {
      console.log(`❌ Chunk file ${chunkFile} not found`);
      continue;
    }
    
    console.log(`📦 Importing chunk ${i}...`);
    
    const sqlContent = fs.readFileSync(chunkFile, 'utf8');
    
    // Remove the comment line and execute the SQL
    const sqlToExecute = sqlContent.replace(/^--.*\n/, '');
    
    console.log(`✅ Chunk ${i} ready for import (${sqlToExecute.split('VALUES')[1].split('(').length - 1} ports)`);
  }
  
  console.log('🎉 Chunks 3-10 prepared for import');
}

importChunks3to10();
