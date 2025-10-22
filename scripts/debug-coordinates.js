const fs = require('fs');

// Debug coordinate parsing
function debugCoordinates() {
  console.log('🔍 Debugging coordinate parsing...');
  
  const filePath = 'Listofports/2024-2 UNLOCODE CodeListPart1.csv';
  const data = fs.readFileSync(filePath, 'utf8');
  const lines = data.split('\n');
  
  let validCoords = 0;
  let invalidCoords = 0;
  
  for (let i = 0; i < Math.min(1000, lines.length); i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const columns = line.split(',');
    if (columns.length < 10) continue;
    
    const [, countryCode, locode, name, , , , , , , coordinates] = columns;
    
    if (!countryCode || !locode || !name) continue;
    
    const { latitude, longitude } = parseCoordinates(coordinates);
    
    if (latitude && longitude) {
      validCoords++;
      if (validCoords <= 5) {
        console.log(`Valid coords: ${coordinates} -> ${latitude}, ${longitude}`);
      }
    } else {
      invalidCoords++;
      if (invalidCoords <= 5) {
        console.log(`Invalid coords: "${coordinates}"`);
      }
    }
  }
  
  console.log(`📊 Valid coords: ${validCoords}, Invalid coords: ${invalidCoords}`);
}

function parseCoordinates(coords) {
  if (!coords) return { latitude: null, longitude: null };
  
  // Format: "4230N 00131E" or "4230N00131E"
  const match = coords.match(/(\d{2})(\d{2})([NS])\s*(\d{3})(\d{2})([EW])/);
  if (!match) return { latitude: null, longitude: null };
  
  const [, latDeg, latMin, latDir, lonDeg, lonMin, lonDir] = match;
  
  let latitude = parseInt(latDeg) + parseInt(latMin) / 60;
  let longitude = parseInt(lonDeg) + parseInt(lonMin) / 60;
  
  if (latDir === 'S') latitude = -latitude;
  if (lonDir === 'W') longitude = -longitude;
  
  return { latitude, longitude };
}

debugCoordinates();
