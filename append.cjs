const fs = require('fs');
const content = fs.readFileSync('scripts/custom-icons.ts', 'utf8');
const newIcons = fs.readFileSync('append_icons.txt', 'utf8');
const stripped = content.trim().replace(/];$/, '');
fs.writeFileSync('scripts/custom-icons.ts', stripped + '\n' + newIcons + '\n];\n');
console.log('Appended successfully');
