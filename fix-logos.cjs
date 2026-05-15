const fs = require('fs');
let content = fs.readFileSync('scripts/custom-icons.ts', 'utf8');

// The issue is `} },` instead of `},`. We need to fix the transition between orb and nexus.
content = content.replace(/}\s*},\s*{ name: 'unique-logo-nexus'/, '},\n  { name: \'unique-logo-nexus\'');

fs.writeFileSync('scripts/custom-icons.ts', content);
console.log('Fixed syntax error in custom-icons.ts');
