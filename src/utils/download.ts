/**
 * download.ts — All download format conversions using Canvas API + JSZip.
 */
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import type { IconEntry, DownloadFormat, PngSize } from '@/data/iconTypes';

import { NEON_HEX } from '@/data/iconTypes';

// ── Build full SVG string from an icon entry ─────────────────
export function buildSvgString(icon: IconEntry, colorOverride?: string, showBorder = true): string {
  // Use explicit color or fallback to the icon's assigned neon color
  const color = colorOverride && colorOverride !== 'currentColor' ? colorOverride : (NEON_HEX[icon.color] ?? '#00B4FF');
  const content = icon.svgContent.replace(/currentColor/g, color);
  
  if (!showBorder) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${icon.viewBox}" width="1024" height="1024" fill="${color}">
  ${content}
</svg>`;
  }

  // Return the SVG mimicking the IconCard styling (88x88px, 3px border, transparent bg)
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 88 88" width="88" height="88">
  <rect x="1.5" y="1.5" width="85" height="85" rx="16" fill="none" stroke="${color}" stroke-width="3" />
  <svg x="17" y="17" width="54" height="54" viewBox="${icon.viewBox}" fill="${color}">
    ${content}
  </svg>
</svg>`;
}

// ── SVG → Blob ────────────────────────────────────────────────
export function svgToBlob(svgString: string): Blob {
  return new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
}

// ── SVG → Canvas (internal helper) ────────────────────────────
async function svgToCanvas(svgString: string, size: number): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    // Transparent background
    ctx.clearRect(0, 0, size, size);

    const img = new Image();
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    img.onload = () => {
      ctx.drawImage(img, 0, 0, size, size);
      URL.revokeObjectURL(url);
      resolve(canvas);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load SVG into image element'));
    };
    img.src = url;
  });
}

// ── SVG → PNG Blob ────────────────────────────────────────────
export async function svgToPng(icon: IconEntry, size: PngSize, colorOverride?: string, showBorder = true): Promise<Blob> {
  const svg = buildSvgString(icon, colorOverride, showBorder);
  const canvas = await svgToCanvas(svg, size);
  return new Promise<Blob>((res, rej) =>
    canvas.toBlob(b => b ? res(b) : rej(new Error('PNG conversion failed')), 'image/png')
  );
}

// ── SVG → JPG Blob ────────────────────────────────────────────
export async function svgToJpg(icon: IconEntry, size: PngSize = 512, colorOverride?: string, showBorder = true): Promise<Blob> {
  const svg = buildSvgString(icon, colorOverride, showBorder);
  const canvas = await svgToCanvas(svg, size);
  // Fill background dark for JPG (no transparency)
  const bgCanvas = document.createElement('canvas');
  bgCanvas.width = size; bgCanvas.height = size;
  const ctx = bgCanvas.getContext('2d')!;
  ctx.fillStyle = '#131319';
  ctx.fillRect(0, 0, size, size);
  ctx.drawImage(canvas, 0, 0);
  return new Promise<Blob>((res, rej) =>
    bgCanvas.toBlob(b => b ? res(b) : rej(new Error('JPG conversion failed')), 'image/jpeg', 0.92)
  );
}

// ── SVG → WebP Blob ───────────────────────────────────────────
export async function svgToWebP(icon: IconEntry, size: PngSize = 512, colorOverride?: string, showBorder = true): Promise<Blob> {
  const svg = buildSvgString(icon, colorOverride, showBorder);
  const canvas = await svgToCanvas(svg, size);
  return new Promise<Blob>((res, rej) =>
    canvas.toBlob(b => b ? res(b) : rej(new Error('WebP conversion failed')), 'image/webp', 0.92)
  );
}

// ── SVG → ICO (16 + 32 + 48px multi-resolution) ──────────────
export async function svgToIco(icon: IconEntry, colorOverride?: string, showBorder = true): Promise<Blob> {
  // Build 32px PNG as best approximation; ICO wrapping is complex in browser.
  // We create a 48×48 PNG and name it .ico for compatibility.
  const svg = buildSvgString(icon, colorOverride, showBorder);
  const canvas = await svgToCanvas(svg, 48);
  return new Promise<Blob>((res, rej) =>
    canvas.toBlob(b => b ? res(b) : rej(new Error('ICO conversion failed')), 'image/png')
  );
}

// ── JSON metadata ─────────────────────────────────────────────
export function iconToJson(icon: IconEntry): Blob {
  const payload = {
    id: icon.id,
    name: icon.name,
    slug: icon.slug || icon.id,
    category: icon.category,
    tags: icon.tags,
    style: icon.style,
    source: icon.source,
    viewBox: icon.viewBox,
    svgContent: icon.svgContent,
    fullSvg: buildSvgString(icon, 'currentColor', false),
  };
  return new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
}

// ── Trigger single download ───────────────────────────────────
export async function downloadIcon(
  icon: IconEntry,
  format: DownloadFormat,
  pngSize: PngSize = 512,
  colorOverride?: string,
  showBorder = true
): Promise<void> {
  const base = (icon.slug || icon.id).replace(/^(custom|lucide|tabler|phosphor|heroicons|bootstrap|iconoir|material)-/, '');
  switch (format) {
    case 'svg': {
      saveAs(svgToBlob(buildSvgString(icon, colorOverride, showBorder)), `${base}.svg`);
      break;
    }
    case 'png': {
      const blob = await svgToPng(icon, pngSize, colorOverride, showBorder);
      saveAs(blob, `${base}-${pngSize}px.png`);
      break;
    }
    case 'jpg': {
      const blob = await svgToJpg(icon, pngSize, colorOverride, showBorder);
      saveAs(blob, `${base}-${pngSize}px.jpg`);
      break;
    }
    case 'webp': {
      const blob = await svgToWebP(icon, pngSize, colorOverride, showBorder);
      saveAs(blob, `${base}-${pngSize}px.webp`);
      break;
    }
    case 'ico': {
      const blob = await svgToIco(icon, colorOverride, showBorder);
      saveAs(blob, `${base}.ico`);
      break;
    }
    case 'json': {
      saveAs(iconToJson(icon), `${base}.json`);
      break;
    }
  }
}

// ── Bulk ZIP download ─────────────────────────────────────────
export async function bulkDownloadZip(
  icons: IconEntry[],
  onProgress?: (pct: number) => void,
  colorOverride?: string,
  showBorder = true
): Promise<void> {
  const zip = new JSZip();

  for (let i = 0; i < icons.length; i++) {
    const icon = icons[i];
    const base = (icon.slug || icon.id).replace(/^(custom|lucide|tabler|phosphor|heroicons|bootstrap|iconoir|material)-/, '');
    const folder = zip.folder(base)!;

    // Always include SVG
    folder.file(`${base}.svg`, buildSvgString(icon, colorOverride, showBorder));
    // JSON metadata
    folder.file(`${base}.json`, JSON.stringify({
      id: icon.id, name: icon.name, category: icon.category,
      tags: icon.tags, style: icon.style, source: icon.source,
      viewBox: icon.viewBox, svgContent: icon.svgContent,
    }, null, 2));

    // PNG at common sizes (batch to avoid memory spikes)
    for (const size of [32, 128, 512] as PngSize[]) {
      try {
        const blob = await svgToPng(icon, size, colorOverride, showBorder);
        folder.file(`${base}-${size}px.png`, blob);
      } catch { /* skip if conversion fails */ }
    }

    onProgress?.(Math.round(((i + 1) / icons.length) * 100));
  }

  const content = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } });
  saveAs(content, `ikonix-icons-${Date.now()}.zip`);
}
