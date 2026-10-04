const fs = require('fs');
const path = require('path');

const componentsDir = 'src/components';
const files = fs.readdirSync(componentsDir).filter(f => f.endsWith('.jsx'));

const mapping = {
  'â€“': '–',
  'â€”': '—',
  'â€™': '\'',
  'ðŸ‘¥': '👥',
  'ðŸ‘¤': '👤',
  'â€¢': '•',
  'â€œ': '“',
  'â€ ': '”',
  '"¢': '•', // User's manual typo
  'Â': '',   // Sometime dangling Â
  'Ã¢â‚¬â€œ': '–',
  'Ã¢â‚¬â€ ': '—',
  'Ã¢â‚¬â„¢': '\'',
  'Ã°Å¸â€˜Â¥': '👥',
  'Ã°Å¸â€˜Â¤': '👤',
  'Ã¢â‚¬Â¢': '•'
};

let totalFixed = 0;

for (const file of files) {
  const filePath = path.join(componentsDir, file);
  let text = fs.readFileSync(filePath, 'utf8');
  let count = 0;
  
  for (const [bad, good] of Object.entries(mapping)) {
    const regex = new RegExp(bad.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    const matches = (text.match(regex) || []).length;
    if (matches > 0) {
      text = text.replace(regex, good);
      count += matches;
    }
  }

  if (text.charCodeAt(0) === 0xFEFF) {
    text = text.slice(1);
    count++;
  }

  if (count > 0) {
    fs.writeFileSync(filePath, text, 'utf8');
    console.log(`Fixed ${count} issues in ${file}`);
    totalFixed += count;
  }
}

console.log('Total fixed: ' + totalFixed);
