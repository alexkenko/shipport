const fs = require('fs');

function splitSQLIntoBatches() {
  try {
    console.log('📖 Reading SQL file...');
    const sql = fs.readFileSync('sql/import_3000_ports.sql', 'utf8');
    
    // Split by VALUES and get the values part
    const parts = sql.split('VALUES\n');
    const header = parts[0] + 'VALUES\n';
    const valuesPart = parts[1].trim();
    
    // Split by lines that start with '(' and end with '),'
    const lines = valuesPart.split('\n');
    const portLines = lines.filter(line => line.trim().startsWith('(') && line.trim().endsWith('),'));
    
    console.log(`📊 Found ${portLines.length} port rows`);
    
    // Create batches of 500 ports each
    const batchSize = 500;
    const totalBatches = Math.ceil(portLines.length / batchSize);
    
    console.log(`📦 Creating ${totalBatches} batches of ${batchSize} ports each...`);
    
    for (let i = 0; i < totalBatches; i++) {
      const start = i * batchSize;
      const end = Math.min(start + batchSize, portLines.length);
      const batchRows = portLines.slice(start, end);
      
      // Remove trailing comma from last row
      const lastRow = batchRows[batchRows.length - 1];
      batchRows[batchRows.length - 1] = lastRow.replace(/,$/, '');
      
      // Reconstruct the batch SQL
      const batchSQL = header + batchRows.join('\n') + ';\n';
      
      const batchNum = String(i + 1).padStart(3, '0');
      const filename = `sql/ports_batch_${batchNum}.sql`;
      
      fs.writeFileSync(filename, batchSQL);
      console.log(`✅ Created ${filename} (${batchRows.length} ports)`);
    }
    
    console.log(`🎉 Created ${totalBatches} batch files`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

splitSQLIntoBatches();
