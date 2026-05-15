const fs = require('fs');

let content = fs.readFileSync('scripts/custom-icons.ts', 'utf8');

// Fix the invalid '}},' syntax if it exists
content = content.replace(/}\s*},\s*{ name: 'unique-logo-swirl-blades'/, '},\n  { name: \'unique-logo-swirl-blades\'');

// Remove trailing bracket
content = content.replace(/\s*\];\s*$/, '');

const premiumLogos = `},
  { name: 'unique-logo-aperture', svgContent: '<path fill="currentColor" d="M12 12C12 5 18 2 22 6C18 8 15 12 12 12ZM12 12C19 12 22 18 18 22C16 18 12 15 12 12ZM12 12C12 19 6 22 2 18C6 16 9 12 12 12ZM12 12C5 12 2 6 6 2C8 6 12 9 12 12Z"/>' },
  { name: 'unique-logo-mountain-twins', svgContent: '<path fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" d="M8 4L2 18H14L8 4Z"/><path fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" d="M16 8L10 22H22L16 8Z"/>' },
  { name: 'unique-logo-abstract-heart', svgContent: '<path fill-rule="evenodd" clip-rule="evenodd" fill="currentColor" d="M16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.03L12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3ZM16 7C14.3431 7 13 8.34315 13 10C13 11.6569 14.3431 13 16 13C17.6569 13 19 11.6569 19 10C19 8.34315 17.6569 7 16 7Z"/>' },
  { name: 'unique-logo-lotus-solid', svgContent: '<path fill="currentColor" d="M12 2C12 2 9 8 9 12C9 16 12 22 12 22C12 22 15 16 15 12C15 8 12 2 12 2Z M2 12C2 12 6 9 10 9C12 9 12 12 12 12C12 12 8 15 4 15C2 15 2 12 2 12Z M22 12C22 12 18 9 14 9C12 9 12 12 12 12C12 12 16 15 20 15C22 15 22 12 22 12Z"/>' },
  { name: 'unique-logo-abstract-g', svgContent: '<path fill-rule="evenodd" clip-rule="evenodd" fill="currentColor" d="M12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12V6H14V12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12H20C20 7.58172 16.4183 4 12 4ZM14 6V8H18V6H14Z"/>' },
  { name: 'unique-logo-overlapping-circles', svgContent: '<path fill="currentColor" d="M8 4A8 8 0 1 0 8 20A8 8 0 1 0 8 4Z M16 4A8 8 0 1 0 16 20A8 8 0 1 0 16 4Z" fill-rule="evenodd"/>' },
  { name: 'unique-logo-dot-matrix-square', svgContent: '<circle cx="4" cy="4" r="1.5" fill="currentColor"/><circle cx="9" cy="4" r="1.5" fill="currentColor"/><circle cx="14" cy="4" r="1.5" fill="currentColor"/><circle cx="19" cy="4" r="1.5" fill="currentColor"/> <circle cx="4" cy="9" r="1.5" fill="currentColor"/><circle cx="9" cy="9" r="1.5" fill="currentColor"/><circle cx="14" cy="9" r="1.5" fill="currentColor"/><circle cx="19" cy="9" r="1.5" fill="currentColor"/> <circle cx="4" cy="14" r="1.5" fill="currentColor"/><circle cx="9" cy="14" r="1.5" fill="currentColor"/><circle cx="14" cy="14" r="1.5" fill="currentColor"/><circle cx="19" cy="14" r="1.5" fill="currentColor"/> <circle cx="4" cy="19" r="1.5" fill="currentColor"/><circle cx="9" cy="19" r="1.5" fill="currentColor"/><circle cx="14" cy="19" r="1.5" fill="currentColor"/><circle cx="19" cy="19" r="1.5" fill="currentColor"/>' },
  { name: 'unique-logo-layer-lines', svgContent: '<path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M2 12C6 16 18 16 22 12 M2 8C6 12 18 12 22 8 M2 16C6 20 18 20 22 16 M2 4C6 8 18 8 22 4 M2 20C6 24 18 24 22 20"/>' },
  { name: 'unique-logo-globe-wire', svgContent: '<circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/><ellipse cx="12" cy="12" rx="4" ry="10" fill="none" stroke="currentColor" stroke-width="2"/><ellipse cx="12" cy="12" rx="10" ry="4" fill="none" stroke="currentColor" stroke-width="2"/>' },
  { name: 'unique-logo-triple-slash', svgContent: '<path fill="currentColor" d="M4 2L10 2L6 22L0 22Z M11 2L17 2L13 22L7 22Z M18 2L24 2L20 22L14 22Z"/>' },
  { name: 'unique-logo-origami-arrow', svgContent: '<path fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round" d="M4 12H16M16 12L10 6M16 12L10 18M20 6V18"/>' },
  { name: 'unique-logo-compass-point', svgContent: '<path fill="currentColor" d="M12 2L16 22L12 17L8 22Z"/><circle cx="12" cy="14" r="10" fill="none" stroke="currentColor" stroke-width="2"/>' },
  { name: 'unique-logo-corner-dots', svgContent: '<rect x="4" y="10" width="12" height="4" rx="2" transform="rotate(45 10 12)" fill="currentColor"/><rect x="10" y="16" width="12" height="4" rx="2" transform="rotate(45 16 18)" fill="currentColor"/><circle cx="6" cy="6" r="2" fill="currentColor"/><circle cx="20" cy="8" r="2" fill="currentColor"/>' },
  { name: 'unique-logo-four-spark', svgContent: '<path fill="currentColor" d="M2 12C6 12 10 8 10 2C10 8 14 12 22 12C14 12 10 16 10 22C10 16 6 12 2 12Z"/>' },
  { name: 'unique-logo-concentric-blocks', svgContent: '<path fill="currentColor" d="M20 4H4V20H20V16H8V8H20V4Z M20 10H12V14H20V10Z"/>' }
];`;

content += premiumLogos;
fs.writeFileSync('scripts/custom-icons.ts', content);
console.log('Appended 15 premium logo icons successfully');
