const fs = require('fs');
let text = fs.readFileSync('src/components/EventsPage.jsx', 'utf8');

text = text.replace(/â”€/g, '─');
text = text.replace(/ðŸŽ™ï¸ /g, '🎙️');
text = text.replace(/MartÃ­nez/g, 'Martínez');

fs.writeFileSync('src/components/EventsPage.jsx', text, 'utf8');
console.log('Fixed final encoding issues');
