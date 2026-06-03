import express from 'express';
import cors from 'cors';
import multer from 'multer';
import mammoth from 'mammoth';
import puppeteer from 'puppeteer';
import * as xlsx from 'xlsx';
import { marked } from 'marked';
import { createRequire } from 'module';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const ICONS_DIR  = path.join(__dirname, '..', 'public', 'icons');

const app = express();
app.use(cors());
app.use(express.json());

// ─────────────────────────────────────────────
// ICON DATA HELPERS
// ─────────────────────────────────────────────

const NEON_HEX = {
  pink: '#FF2D78', purple: '#BE00FF', blue: '#00B4FF', green: '#00FF87',
  orange: '#FF6B00', yellow: '#FFE600', red: '#FF2525', cyan: '#00FFFF',
  violet: '#7B2FFF', lime: '#AAFF00', white: '#FFFFFF', black: '#000000',
};

const VALID_SIZES = new Set([16, 32, 64, 128, 256, 512, 1024, 2048, 4096]);

/** Lean manifest entries (id, name, category, color, chunk). Loaded once at startup. */
let manifestEntries = [];
/** Full icon data keyed by id. Chunks are loaded on demand and kept in memory. */
const iconCache = new Map();
/** Which chunk indices are already loaded. */
const loadedChunks = new Set();
/**
 * Short-name → full ID map.
 * e.g. "a-arrow-down" → "lucide-outline-a-arrow-down"
 * Built from the manifest. Custom-source icons take priority on collision.
 */
const nameIndex = new Map();

// Strip "{source}-{style}-" prefix to get the clean icon name
const STRIP_PREFIX = /^(?:custom|lucide|tabler|phosphor|bootstrap|heroicons|iconoir|material)-(?:outline|filled|bold|thin|duotone|glyph)-/;

function iconNameFromId(id) {
  return id.replace(STRIP_PREFIX, '');
}

async function loadManifest() {
  if (manifestEntries.length) return;
  const raw  = await fs.readFile(path.join(ICONS_DIR, 'index.json'), 'utf-8');
  const data = JSON.parse(raw);
  manifestEntries = (data.icons ?? []).map(r => ({
    id: r.id,
    name: r.n ?? r.name ?? '',
    category: r.c ?? r.category ?? 'technology',
    color: r.l ?? r.color ?? 'blue',
    chunk: r.k ?? r.chunk ?? 0,
  }));

  // Build name index — custom-source icons win on collision
  for (const entry of manifestEntries) {
    const shortName = iconNameFromId(entry.id);
    if (!nameIndex.has(shortName) || entry.id.startsWith('custom-')) {
      nameIndex.set(shortName, entry.id);
    }
  }
}

async function ensureChunk(chunkIndex) {
  if (loadedChunks.has(chunkIndex)) return;
  const raw   = await fs.readFile(path.join(ICONS_DIR, 'chunks', `chunk-${chunkIndex}.json`), 'utf-8');
  const icons = JSON.parse(raw);
  icons.forEach(ic => iconCache.set(ic.id, ic));
  loadedChunks.add(chunkIndex);
}

/** Resolve by full ID or by short name (e.g. "a-arrow-down"). */
async function getIconData(idOrName) {
  await loadManifest();
  // 1. exact ID hit (already cached)
  if (iconCache.has(idOrName)) return iconCache.get(idOrName);
  // 2. exact ID in manifest
  let entry = manifestEntries.find(e => e.id === idOrName);
  // 3. short name lookup
  if (!entry) {
    const resolvedId = nameIndex.get(idOrName);
    if (resolvedId) entry = manifestEntries.find(e => e.id === resolvedId);
  }
  if (!entry) return null;
  await ensureChunk(entry.chunk);
  return iconCache.get(entry.id) ?? null;
}

function buildSvgString(icon, colorOverride, showBorder = true, size = 512) {
  let color = NEON_HEX[icon.color] ?? '#00B4FF';
  if (colorOverride && colorOverride !== 'currentColor') {
    color = colorOverride.startsWith('#') ? colorOverride : `#${colorOverride}`;
  }
  const content = icon.svgContent.replace(/currentColor/g, color);

  if (!showBorder) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${icon.viewBox}" width="${size}" height="${size}" fill="${color}">\n  ${content}\n</svg>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 88 88" width="${size}" height="${size}">
  <rect x="1.5" y="1.5" width="85" height="85" rx="16" fill="none" stroke="${color}" stroke-width="3"/>
  <svg x="17" y="17" width="54" height="54" viewBox="${icon.viewBox}" fill="${color}">
    ${content}
  </svg>
</svg>`;
}

// ─────────────────────────────────────────────
// PUPPETEER SINGLETON (shared across icon & doc conversions)
// ─────────────────────────────────────────────

let _browser = null;

async function getBrowser() {
  if (_browser && _browser.connected) return _browser;
  _browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  return _browser;
}

async function svgToRaster(svgString, size, format, bgColor = null) {
  const browser = await getBrowser();
  const page    = await browser.newPage();
  try {
    await page.setViewport({ width: size, height: size, deviceScaleFactor: 1 });
    const b64 = Buffer.from(svgString).toString('base64');
    const bg  = bgColor ? `background:${bgColor};` : 'background:transparent;';
    await page.setContent(
      `<!DOCTYPE html><html><body style="margin:0;padding:0;${bg}overflow:hidden;">` +
      `<img src="data:image/svg+xml;base64,${b64}" width="${size}" height="${size}" style="display:block;">` +
      `</body></html>`,
      { waitUntil: 'load' },
    );
    return await page.screenshot({
      type: format === 'jpeg' ? 'jpeg' : 'png',
      quality: format === 'jpeg' ? 92 : undefined,
      omitBackground: !bgColor,
    });
  } finally {
    await page.close();
  }
}

// ─────────────────────────────────────────────
// ICON REST API
// ─────────────────────────────────────────────

/**
 * GET /api/icons
 * List / search icons.
 *
 * Query params:
 *   q        — search term (matches name)
 *   category — filter by category id
 *   page     — 1-based page number (default 1)
 *   limit    — results per page (default 50, max 200)
 *
 * Response: { total, page, limit, icons: [{ id, name, category, color }] }
 */
app.get('/api/icons', async (req, res) => {
  try {
    await loadManifest();

    let results = manifestEntries;

    const q        = (req.query.q        ?? '').toLowerCase().trim();
    const category = (req.query.category ?? '').trim();
    const page     = Math.max(1, parseInt(req.query.page  ?? '1', 10));
    const limit    = Math.min(200, Math.max(1, parseInt(req.query.limit ?? '50', 10)));

    if (q)        results = results.filter(e => e.name.toLowerCase().includes(q) || e.category.includes(q));
    if (category && category !== 'all') results = results.filter(e => e.category === category);

    const total  = results.length;
    const offset = (page - 1) * limit;
    const icons  = results.slice(offset, offset + limit).map(e => ({
      id: e.id, iconName: iconNameFromId(e.id), name: e.name, category: e.category, color: e.color,
    }));

    res.json({ total, page, limit, icons });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/categories
 * Returns all available category ids and labels.
 */
app.get('/api/categories', async (req, res) => {
  try {
    await loadManifest();
    const counts = {};
    for (const e of manifestEntries) counts[e.category] = (counts[e.category] ?? 0) + 1;

    const LABELS = {
      technology: 'Technology', communication: 'Communication', data: 'Data & Analytics',
      'ui-controls': 'UI / UX Controls', weather: 'Weather', emotions: 'Emotions & People',
      shopping: 'Shopping & E-Commerce', 'social-media': 'Social Media', brands: 'Brands & Logos',
      arrows: 'Arrows & Navigation', 'file-types': 'File Types', security: 'Security',
      medical: 'Medical & Health', travel: 'Travel & Transport', business: 'Business & Finance',
      'food-drink': 'Food & Drink', nature: 'Nature & Environment', education: 'Education',
      accessibility: 'Accessibility', sports: 'Sports & Recreation', roles: 'User Roles & Staff',
      unique: 'Unique & Abstract',
    };

    const categories = Object.entries(counts).map(([id, count]) => ({
      id, label: LABELS[id] ?? id, count,
    })).sort((a, b) => a.id.localeCompare(b.id));

    res.json({ total: manifestEntries.length, categories });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/icons/:id
 * Full icon metadata including SVG content.
 */
app.get('/api/icons/:id', async (req, res) => {
  try {
    const icon = await getIconData(req.params.id);
    if (!icon) return res.status(404).json({ error: 'Icon not found' });
    res.json({
      id: icon.id, iconName: iconNameFromId(icon.id), name: icon.name,
      category: icon.category, tags: icon.tags ?? [], style: icon.style,
      source: icon.source, viewBox: icon.viewBox, color: icon.color,
      svgContent: icon.svgContent,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/icons/:id/svg
 * Returns the SVG file directly.
 *
 * Query params:
 *   color  — hex color without # (e.g. FF2D78) or named neon key (pink, blue…)
 *   border — "true" / "false" (default true)
 *   size   — pixel size for width/height attribute (default 512)
 */
app.get('/api/icons/:id/svg', async (req, res) => {
  try {
    const icon = await getIconData(req.params.id);
    if (!icon) return res.status(404).json({ error: 'Icon not found' });

    const color     = req.query.color  ?? null;
    const border    = req.query.border !== 'false';
    const size      = parseInt(req.query.size ?? '512', 10);
    const svgString = buildSvgString(icon, color, border, size);

    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Content-Disposition', `inline; filename="${icon.slug ?? icon.id}.svg"`);
    res.send(svgString);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/icons/:id/png
 * Returns a PNG raster image.
 *
 * Query params:
 *   size   — pixel size: 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096 (default 512)
 *   color  — hex or neon key
 *   border — "true" / "false" (default true)
 */
app.get('/api/icons/:id/png', async (req, res) => {
  try {
    const icon = await getIconData(req.params.id);
    if (!icon) return res.status(404).json({ error: 'Icon not found' });

    const size = parseInt(req.query.size ?? '512', 10);
    if (!VALID_SIZES.has(size)) {
      return res.status(400).json({ error: `Invalid size. Valid sizes: ${[...VALID_SIZES].join(', ')}` });
    }

    const color     = req.query.color ?? null;
    const border    = req.query.border !== 'false';
    const svgString = buildSvgString(icon, color, border, size);
    const buffer    = await svgToRaster(svgString, size, 'png');

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', `inline; filename="${icon.slug ?? icon.id}-${size}.png"`);
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/icons/:id/jpg
 * Returns a JPEG raster image (dark background).
 *
 * Query params: same as /png
 */
app.get('/api/icons/:id/jpg', async (req, res) => {
  try {
    const icon = await getIconData(req.params.id);
    if (!icon) return res.status(404).json({ error: 'Icon not found' });

    const size = parseInt(req.query.size ?? '512', 10);
    if (!VALID_SIZES.has(size)) {
      return res.status(400).json({ error: `Invalid size. Valid sizes: ${[...VALID_SIZES].join(', ')}` });
    }

    const color     = req.query.color ?? null;
    const border    = req.query.border !== 'false';
    const svgString = buildSvgString(icon, color, border, size);
    const buffer    = await svgToRaster(svgString, size, 'jpeg', '#131319');

    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Content-Disposition', `inline; filename="${icon.slug ?? icon.id}-${size}.jpg"`);
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/icons/:id/webp
 * Returns a WebP raster image.
 *
 * Query params: same as /png
 */
app.get('/api/icons/:id/webp', async (req, res) => {
  try {
    const icon = await getIconData(req.params.id);
    if (!icon) return res.status(404).json({ error: 'Icon not found' });

    const size = parseInt(req.query.size ?? '512', 10);
    if (!VALID_SIZES.has(size)) {
      return res.status(400).json({ error: `Invalid size. Valid sizes: ${[...VALID_SIZES].join(', ')}` });
    }

    const color     = req.query.color ?? null;
    const border    = req.query.border !== 'false';
    const svgString = buildSvgString(icon, color, border, size);
    const buffer    = await svgToRaster(svgString, size, 'webp');

    res.setHeader('Content-Type', 'image/webp');
    res.setHeader('Content-Disposition', `inline; filename="${icon.slug ?? icon.id}-${size}.webp"`);
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────
// FILE CONVERSION (original endpoint)
// ─────────────────────────────────────────────

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } });

app.post('/api/convert', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const sourceFormat = req.body.sourceFormat?.toLowerCase();
    const targetFormat = req.body.targetFormat?.toLowerCase();

    console.log(`[CONVERSION REQUEST] ${sourceFormat?.toUpperCase()} -> ${targetFormat?.toUpperCase()}`);

    const renderPDF = async (htmlContent, landscape = false) => {
      const browser = await getBrowser();
      const page    = await browser.newPage();
      await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        landscape,
        margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' },
      });
      await page.close();
      return pdfBuffer;
    };

    if (sourceFormat === 'docx' && targetFormat === 'pdf') {
      const result = await mammoth.convertToHtml({ buffer: req.file.buffer });
      const htmlContent = `
        <html><head><style>
          body { font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; }
          img { max-width: 100%; }
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #ddd; padding: 8px; }
        </style></head><body>${result.value}</body></html>`;
      const pdfBuffer = await renderPDF(htmlContent);
      res.setHeader('Content-Type', 'application/pdf');
      return res.send(pdfBuffer);
    }

    if (['xlsx', 'xls', 'csv', 'ods'].includes(sourceFormat)) {
      const workbook       = xlsx.read(req.file.buffer, { type: 'buffer' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet      = workbook.Sheets[firstSheetName];

      if (targetFormat === 'pdf') {
        const htmlTable   = xlsx.utils.sheet_to_html(worksheet);
        const htmlContent = `
          <html><head><style>
            body { font-family: sans-serif; padding: 20px; }
            table { border-collapse: collapse; width: 100%; font-size: 12px; }
            th, td { border: 1px solid #ccc; padding: 6px; text-align: left; }
            th { background-color: #f4f4f4; }
          </style></head><body>${htmlTable}</body></html>`;
        const pdfBuffer = await renderPDF(htmlContent, true);
        res.setHeader('Content-Type', 'application/pdf');
        return res.send(pdfBuffer);
      }
      if (targetFormat === 'csv') {
        res.setHeader('Content-Type', 'text/csv');
        return res.send(xlsx.utils.sheet_to_csv(worksheet));
      }
      if (targetFormat === 'xlsx') {
        const outBuffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        return res.send(outBuffer);
      }
    }

    if (['md', 'txt', 'html', 'json', 'xml'].includes(sourceFormat) && targetFormat === 'pdf') {
      const textContent = req.file.buffer.toString('utf-8');
      let htmlContent   = '';

      if (sourceFormat === 'md') {
        htmlContent = `
          <html><head><style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 30px; line-height: 1.6; color: #333; }
            pre { background: #f4f4f4; padding: 15px; border-radius: 5px; overflow-x: auto; }
            code { font-family: monospace; background: #f4f4f4; padding: 2px 4px; border-radius: 3px; }
            blockquote { border-left: 4px solid #ccc; margin: 0; padding-left: 15px; color: #666; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ddd; padding: 8px; }
          </style></head><body>${marked.parse(textContent)}</body></html>`;
      } else if (sourceFormat === 'html') {
        htmlContent = textContent;
      } else {
        const escaped = textContent.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        htmlContent = `
          <html><head><style>
            body { background: #1e1e1e; color: #d4d4d4; padding: 20px; margin: 0; }
            pre { font-family: 'Consolas', 'Courier New', monospace; font-size: 14px; white-space: pre-wrap; word-wrap: break-word; }
          </style></head><body><pre>${escaped}</pre></body></html>`;
      }

      const pdfBuffer = await renderPDF(htmlContent);
      res.setHeader('Content-Type', 'application/pdf');
      return res.send(pdfBuffer);
    }

    if (sourceFormat === 'pdf' && targetFormat === 'txt') {
      const data = await pdfParse(req.file.buffer);
      res.setHeader('Content-Type', 'text/plain');
      return res.send(data.text);
    }

    return res.status(400).json({
      error: `Backend conversion for ${sourceFormat?.toUpperCase()} to ${targetFormat?.toUpperCase()} requires a proprietary rendering engine and cannot be performed with open-source software. Please use a cloud API for this specific conversion.`,
    });

  } catch (error) {
    console.error('Conversion Error:', error);
    res.status(500).json({ error: error.message || 'Internal server error during conversion' });
  }
});

// ─────────────────────────────────────────────
// START
// ─────────────────────────────────────────────

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  try { await loadManifest(); } catch (e) { console.warn('[icons] Could not pre-load manifest:', e.message); }
  console.log(`🚀 Vectra API running on http://localhost:${PORT}`);
  console.log(`   Icon REST API: http://localhost:${PORT}/api/icons`);
});
