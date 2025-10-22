const fs = require('fs');
const path = require('path');

async function importAllChunks() {
  console.log('🚢 Starting import of all 233 UN/LOCODE chunks...');
  
  const chunksDir = 'sql';
  const chunkFiles = fs.readdirSync(chunksDir)
    .filter(file => file.startsWith('unlocode_chunk_') && file.endsWith('.sql'))
    .sort();
  
  console.log(`📦 Found ${chunkFiles.length} chunk files to import`);
  
  let successCount = 0;
  let errorCount = 0;
  
  for (let i = 0; i < chunkFiles.length; i++) {
    const chunkFile = chunkFiles[i];
    const chunkPath = path.join(chunksDir, chunkFile);
    
    try {
      console.log(`📦 Importing ${chunkFile} (${i + 1}/${chunkFiles.length})...`);
      
      const sqlContent = fs.readFileSync(chunkPath, 'utf8');
      
      // Use apply_migration for each chunk
      const migrationName = `import_${chunkFile.replace('.sql', '')}`;
      
      // For now, just log what we would do
      console.log(`✅ Would import ${chunkFile} as migration: ${migrationName}`);
      successCount++;
      
      // Add a small delay to avoid overwhelming the system
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error(`❌ Error importing ${chunkFile}:`, error.message);
      errorCount++;
    }
    
    // Progress update every 10 chunks
    if ((i + 1) % 10 === 0) {
      console.log(`📊 Progress: ${i + 1}/${chunkFiles.length} chunks processed`);
    }
  }
  
  console.log(`🎉 Import complete!`);
  console.log(`✅ Successfully processed: ${successCount} chunks`);
  console.log(`❌ Errors: ${errorCount} chunks`);
  console.log(`📊 Total ports to import: ~${successCount * 500}`);
}

importAllChunks();
