const fs = require('fs');
let text = fs.readFileSync('src/components/EventsPage.jsx', 'utf8');

text = text.replace(/judges' decision/g, "judges\\' decision");
text = text.replace(/India's/g, "India\\'s");
text = text.replace(/Chennai's/g, "Chennai\\'s");
text = text.replace(/it's/g, "it\\'s");
text = text.replace(/aren't/g, "aren\\'t");

fs.writeFileSync('src/components/EventsPage.jsx', text, 'utf8');
console.log('Fixed quotes');
