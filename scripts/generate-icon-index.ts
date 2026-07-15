/**
 * generate-icon-index.ts (v8 — Custom icons only)
 * Uses our own custom handcrafted icons.
 */
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
// Use ts-node/tsx import resolution, assuming these are resolvable relative to this file
import { CUSTOM_ICONS } from './custom-icons';
import { categorizeByKeywords } from '../src/data/categories';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT       = path.resolve(__dirname, '..');
const OUT_SVG    = path.join(ROOT, 'public', 'icons', 'svg');
const OUT_CHUNKS = path.join(ROOT, 'public', 'icons', 'chunks');
const INDEX_PATH = path.join(ROOT, 'public', 'icons', 'index.json');
const CHUNK_SIZE = 500;

const NEON = ['pink','purple','blue','green','orange','yellow','red','cyan','violet','lime'] as const;
type Neon = typeof NEON[number];
let nc = 0;
const nextNeon = (): Neon => NEON[nc++ % NEON.length];

function toTitle(s: string) { return s.replace(/[-_]/g,' ').replace(/\b\w/g,c=>c.toUpperCase()); }
function slugify(s: string) { return s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''); }

type IconStyle = 'outline' | 'filled' | 'bold' | 'thin' | 'duotone' | 'glyph';

interface FullIcon {
  id: string; name: string; slug: string; category: string; tags: string[]; style: IconStyle;
  source: string; svgContent: string; viewBox: string; color: Neon;
}
interface ManifestEntry { id: string; n: string; c: string; l: string; k: number; }

async function main() {
  console.log('╔══════════════════════════════════╗');
  console.log('║  IconVault Generator v8           ║');
  console.log('║  Custom Handcrafted Icons Only    ║');
  console.log('╚══════════════════════════════════╝\n');

  fs.mkdirSync(OUT_CHUNKS, { recursive: true });
  fs.mkdirSync(OUT_SVG, { recursive: true });

  const rawIcons = CUSTOM_ICONS.map(ic => {
    const cleanName = ic.name.replace(/^brand-/, '');
    const slug = slugify(cleanName);
    const category = categorizeByKeywords(ic.name);
    return {
      id: slugify(`custom-${cleanName}`),
      name: toTitle(cleanName),
      slug,
      category,
      tags: Array.from(new Set([...slug.split('-').filter(Boolean), category])),
      style: 'filled' as IconStyle, // custom icons are solid fill="currentColor" paths
      source: 'custom',
      svgContent: ic.svgContent, // already uses currentColor
      viewBox: ic.viewBox || '0 0 24 24',
      color: nextNeon(),
    };
  });

  const icons: FullIcon[] = [];
  const seen = new Set<string>();
  for (const ic of rawIcons) {
    if (!seen.has(ic.id)) {
      seen.add(ic.id);
      icons.push(ic);
    }
  }

  console.log(`✅ Total custom icons: ${icons.length}`);

  console.log('💾 Writing SVG files…');
  for (const icon of icons) {
    fs.writeFileSync(
      path.join(OUT_SVG, `${icon.id}.svg`),
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${icon.viewBox}" width="24" height="24">${icon.svgContent}</svg>`,
      'utf8'
    );
  }

  console.log('📦 Writing chunks…');
  const totalChunks = Math.ceil(icons.length / CHUNK_SIZE);
  for (let c = 0; c < totalChunks; c++) {
    fs.writeFileSync(
      path.join(OUT_CHUNKS, `chunk-${c}.json`),
      JSON.stringify(icons.slice(c * CHUNK_SIZE, (c + 1) * CHUNK_SIZE)),
      'utf8'
    );
  }

  const manifest: ManifestEntry[] = icons.map((icon, i) => ({
    id: icon.id, n: icon.name, c: icon.category, l: icon.color, k: Math.floor(i / CHUNK_SIZE),
  }));
  const payload = { v: '8.0', generatedAt: new Date().toISOString(), total: icons.length, chunkSize: CHUNK_SIZE, totalChunks, icons: manifest };
  fs.writeFileSync(INDEX_PATH, JSON.stringify(payload), 'utf8');

  console.log('\n🎉 Done! Generator v8 finished.');
}

main().catch(console.error);
