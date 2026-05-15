const fs = require('fs');
let content = fs.readFileSync('scripts/custom-icons.ts', 'utf8');

// Fix any instance of double closing braces in the array
content = content.replace(/}\s*},\s*{/g, '},\n  {');

fs.writeFileSync('scripts/custom-icons.ts', content);
console.log('Fixed double brace syntax error!');
