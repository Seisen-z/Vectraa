/**
 * generate-icon-index.ts (v6 — Custom icons only)
 * Uses our own custom handcrafted icons, no Bootstrap/Lucide.
 */
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
// Use ts-node/tsx import resolution, assuming custom-icons.ts is in same dir
import { CUSTOM_ICONS } from './custom-icons';

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

function assignCat(name: string): string {
  if (name.toLowerCase().startsWith('role-') || name.match(/admin|staff|vip|moderator|support|role|manager|director|employee|user|users|premium|buyer|owner|developer|member/)) return 'roles';
  if (name.match(/heart|smile|face|sad|laugh|cry|angry|person|people|boy|girl/)) return 'emotions';
  if (name.match(/home|settings|search|menu|check|x|plus|minus|zoom|grid|list|filter|sort/)) return 'ui-controls';
  if (name.match(/diamond|crown|money|coin|dollar|euro|bank|briefcase|trend|wallet/)) return 'business';
  if (name.match(/headphones|music|video|camera|mic|phone|chat|message|mail|send|inbox/)) return 'communication';
  if (name.match(/shield|lock|key|fingerprint|password|guard|safe/)) return 'security';
  if (name.match(/bolt|cloud|star|sun|moon|rain|snow|wind|lightning/)) return 'weather';
  if (name.match(/book|school|pen|pencil|graduation|study|read/)) return 'education';
  if (name.match(/rocket|bot|code|laptop|computer|mobile|tablet|mouse|keyboard|wifi|bluetooth|usb/)) return 'technology';
  if (name.match(/car|bus|train|plane|ship|bike|taxi|truck/)) return 'travel';
  if (name.match(/leaf|tree|flower|plant|bug|animal|dog|cat/)) return 'nature';
  if (name.match(/hospital|heartbeat|pill|syringe|medkit|doctor|medical/)) return 'medical';
  if (name.match(/food|drink|coffee|pizza|burger|cake/)) return 'food-drink';
  
  if (name.match(/cart|bag|shop|store|buy|sell|payment|card|discount|coupon|receipt|order|shipping/)) return 'shopping';
  if (name.match(/chart|graph|bar|pie|line|analytics|data|statistics|report|dashboard|metric/)) return 'data';
  if (name.match(/^brand-/)) return 'brands';
  if (name.match(/social|share|like|follow|profile|feed|post|story|reel|live|hashtag|facebook|twitter|instagram|tiktok|youtube|twitch|linkedin/)) return 'social-media';
  if (name.match(/arrow|navigate|direction|up|down|left|right|back|forward|refresh|rotate|flip|swap|move|next|previous/)) return 'arrows';
  if (name.match(/file|document|pdf|doc|xls|ppt|txt|csv|json|xml|html|css|js|ts|zip|folder|upload|download|copy|paste/)) return 'file-types';
  if (name.match(/accessibility|disability|wheelchair|blind|deaf|hearing|visual|braille|sign|caption|subtitle|inclusive/)) return 'accessibility';
  if (name.match(/sport|football|soccer|basketball|tennis|baseball|golf|swim|run|gym|fitness|trophy|medal|game|play|team|athlete|race/)) return 'sports';
  if (name.match(/unique|abstract|random|geometry|pattern/)) return 'unique';

  const fallbacks = ['ui-controls', 'technology', 'business', 'communication', 'nature', 'arrows', 'shopping', 'data', 'social-media', 'file-types', 'accessibility', 'sports', 'brands', 'unique'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
  return fallbacks[hash % fallbacks.length];
}

function toTitle(s: string) { return s.replace(/[-_]/g,' ').replace(/\b\w/g,c=>c.toUpperCase()); }
function slugify(s: string) { return s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''); }

interface FullIcon {
  id: string; name: string; category: string;
  source: string; svgContent: string; viewBox: string; color: Neon;
}
interface ManifestEntry { id:string; n:string; c:string; l:string; k:number; }

async function main() {
  console.log('╔══════════════════════════════════╗');
  console.log('║  IconVault Generator v6           ║');
  console.log('║  Custom Handcrafted Icons Only    ║');
  console.log('╚══════════════════════════════════╝\n');

  console.log('🧹 Cleaning chunks & SVGs (skipped to avoid hangs)…');
  // fs.rmSync(OUT_CHUNKS, { recursive: true, force: true });
  // fs.rmSync(OUT_SVG, { recursive: true, force: true });
  fs.mkdirSync(OUT_CHUNKS, { recursive: true });
  fs.mkdirSync(OUT_SVG, { recursive: true });

  const rawIcons = CUSTOM_ICONS.map(ic => {
    const cleanName = ic.name.replace(/^brand-/, '');
    return {
      id: slugify(`custom-${cleanName}`),
      name: toTitle(cleanName),
      category: assignCat(ic.name), // Use original name so category rules still work
      source: 'custom',
      svgContent: ic.svgContent, // already uses currentColor
      viewBox: ic.viewBox || '0 0 24 24',
      color: nextNeon()
    };
  });

  const icons: FullIcon[] = [];
  const seen = new Set();
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
  const totalChunks = Math.ceil(icons.length/CHUNK_SIZE);
  for (let c=0; c<totalChunks; c++) {
    fs.writeFileSync(
      path.join(OUT_CHUNKS,`chunk-${c}.json`),
      JSON.stringify(icons.slice(c*CHUNK_SIZE,(c+1)*CHUNK_SIZE)),
      'utf8'
    );
  }

  const manifest: ManifestEntry[] = icons.map((icon,i)=>({
    id: icon.id, n: icon.name, c: icon.category, l: icon.color, k: Math.floor(i/CHUNK_SIZE),
  }));
  const payload = { v:'6.0', generatedAt:new Date().toISOString(), total:icons.length, chunkSize:CHUNK_SIZE, totalChunks, icons:manifest };
  fs.writeFileSync(INDEX_PATH, JSON.stringify(payload), 'utf8');

  console.log('\n🎉 Done! Generator v6 finished.');
}

main().catch(console.error);
