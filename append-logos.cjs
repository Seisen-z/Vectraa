const fs = require('fs');
let content = fs.readFileSync('scripts/custom-icons.ts', 'utf8');
const newIcons = fs.readFileSync('logo-icons.txt', 'utf8');
content = content.replace(/\s*\];\s*$/, '},\n' + newIcons + '\n];\n');
fs.writeFileSync('scripts/custom-icons.ts', content);
console.log('Appended logo icons successfully');
