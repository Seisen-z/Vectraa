const fs = require('fs');
let content = fs.readFileSync('scripts/custom-icons.ts', 'utf8');
// Find the missing comma
content = content.replace(/}\r?\n\r?\n\s*{ name: 'unique-abstract-wave'/, '},\n  { name: \'unique-abstract-wave\'');
fs.writeFileSync('scripts/custom-icons.ts', content);
console.log('Fixed missing comma');
