const fs = require('fs');

let content = fs.readFileSync('scripts/custom-icons.ts', 'utf8');

// Replace the specific `}},` with `},` that caused the syntax error
content = content.replace(/}\s*}\s*,\s*{\s*name:\s*'unique-logo-swirl-blades'/, '},\n  { name: \'unique-logo-swirl-blades\'');

fs.writeFileSync('scripts/custom-icons.ts', content);
console.log('Fixed syntax error!');
