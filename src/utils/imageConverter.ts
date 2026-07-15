/// <reference types="vite/client" />
/**
 * imageConverter.ts
 * Advanced modular conversion engine supporting native canvas and WASM decoders.
 */

import heic2any from 'heic2any';
import * as pdfjsLib from 'pdfjs-dist';
import { jsPDF } from 'jspdf';
import { initializeImageMagick, ImageMagick, MagickFormat } from '@imagemagick/magick-wasm';
// @ts-ignore
import magickWasmUrl from '@imagemagick/magick-wasm/magick.wasm?url';
import { wrapPngAsIco } from './ico';

// ── INIT PDF WORKER (Safest CDN approach for Vite) ──
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

// ── INIT IMAGEMAGICK (Lazy) ──
let magickInitialized = false;
async function initMagick() {
  if (!magickInitialized) {
    const wasmBytes = await fetch(magickWasmUrl).then(res => res.arrayBuffer());
    await initializeImageMagick(new Uint8Array(wasmBytes));
    magickInitialized = true;
  }
}

// ── FORMAT DICTIONARIES ──
const SERVER_REQUIRED_FORMATS = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'csv', 'ods', 'odp', 'odt', 'rtf', 'md', 'html', 'epub', 'mobi', 'azw3', 'xml', 'json', 'latex', 'tex', 'xps', 'ps'];
const MAGICK_FORMATS = ['psd', 'tiff', 'tif', 'raw', 'dng', 'exr', 'dds', 'tga', 'xcf', 'kra', 'jxl'];
const HEIC_FORMATS = ['heic', 'avif']; // heic2any handles both HEIC and AVIF often, but let's route them

export async function convertImage(file: File, targetFormat: string): Promise<Blob> {
  const sourceExt = file.name.split('.').pop()?.toLowerCase() || '';
  const targetExt = targetFormat.toLowerCase();

  // 1. Backend Server Pipeline (For complex document formatting)
  if (SERVER_REQUIRED_FORMATS.includes(sourceExt) || SERVER_REQUIRED_FORMATS.includes(targetExt)) {
    return new Promise(async (resolve, reject) => {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('sourceFormat', sourceExt);
        formData.append('targetFormat', targetExt);

        const API_BASE = (import.meta.env && import.meta.env.VITE_API_URL) || 'http://localhost:3000';
        const response = await fetch(`${API_BASE}/api/convert`, {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Server conversion failed with status ${response.status}`);
        }

        const blob = await response.blob();
        resolve(blob);
      } catch (err: any) {
        if (err.message.includes('Failed to fetch') || err.message.includes('ECONNREFUSED')) {
          reject(new Error('The conversion server is not running. Please start the backend server (npm run dev:all) to use this feature.'));
        } else {
          reject(new Error(err.message || 'Failed to communicate with the backend conversion server.'));
        }
      }
    });
  }

  // 2. Outputting to PDF Pipeline (jsPDF)
  if (targetExt === 'pdf') {
    if (sourceExt === 'pdf') throw new Error('Cannot convert PDF to PDF');
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(url);
        try {
          // A4 page dimensions roughly
          const pdf = new jsPDF({
            orientation: img.width > img.height ? 'landscape' : 'portrait',
            unit: 'px',
            format: [img.width, img.height]
          });
          pdf.addImage(img, 'JPEG', 0, 0, img.width, img.height);
          resolve(pdf.output('blob'));
        } catch(e) { reject(e); }
      };
      img.onerror = () => reject(new Error('Failed to load image for PDF conversion'));
      img.src = url;
    });
  }

  // 3. Inputting from PDF Pipeline (pdfjs-dist)
  if (sourceExt === 'pdf') {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    const page = await pdf.getPage(1); // Convert first page only
    const viewport = page.getViewport({ scale: 2.0 }); // High res
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas not available');
    
    // @ts-ignore
    await page.render({ canvasContext: ctx, viewport }).promise;
    
    let mime = 'image/png';
    if (targetExt === 'jpg' || targetExt === 'jpeg') mime = 'image/jpeg';
    else if (targetExt === 'webp') mime = 'image/webp';
    
    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('Canvas export failed')), mime, 0.95);
    });
  }

  // 4. HEIC / AVIF Pipeline (heic2any)
  if (HEIC_FORMATS.includes(sourceExt)) {
    let toType = 'image/png';
    if (targetExt === 'jpg' || targetExt === 'jpeg') toType = 'image/jpeg';
    
    const result = await heic2any({
      blob: file,
      toType: toType,
      quality: 0.95
    });
    
    // heic2any can return Blob or Blob[]
    if (Array.isArray(result)) return result[0];
    return result as Blob;
  }

  // 5. ImageMagick Pipeline (PSD, RAW, TIFF, EXR, etc) — routes on source OR target format,
  // since converting TO a Magick-only format (e.g. PNG -> PSD) needs this pipeline too.
  if (MAGICK_FORMATS.includes(sourceExt) || MAGICK_FORMATS.includes(targetExt)) {
    await initMagick();
    const arrayBuffer = await file.arrayBuffer();

    let mFormat: MagickFormat | null = null;
    if (targetExt === 'png') mFormat = MagickFormat.Png;
    else if (targetExt === 'jpg' || targetExt === 'jpeg') mFormat = MagickFormat.Jpeg;
    else if (targetExt === 'webp') mFormat = MagickFormat.WebP;
    else if (targetExt === 'gif') mFormat = MagickFormat.Gif;
    else if (targetExt === 'bmp') mFormat = MagickFormat.Bmp;
    else if (targetExt === 'ico') mFormat = MagickFormat.Ico;
    else if (targetExt === 'tiff' || targetExt === 'tif') mFormat = MagickFormat.Tiff;
    else if (targetExt === 'psd') mFormat = MagickFormat.Psd;
    else if (targetExt === 'tga') mFormat = MagickFormat.Tga;
    else if (targetExt === 'dds') mFormat = MagickFormat.Dds;
    else if (targetExt === 'exr') mFormat = MagickFormat.Exr;

    // Rather than silently emitting mislabeled PNG bytes for an unmapped target
    // (e.g. kra, xcf, jxl, raw, dng), fail loudly so the user knows it's unsupported.
    if (!mFormat) {
      throw new Error(`Conversion to .${targetExt} is not supported yet.`);
    }

    return new Promise((resolve, reject) => {
      try {
        ImageMagick.read(new Uint8Array(arrayBuffer), (img) => {
          img.write(mFormat, (data) => {
            let mime = `image/${targetExt === 'jpg' ? 'jpeg' : targetExt}`;
            resolve(new Blob([data as any], { type: mime }));
          });
        });
      } catch (err: any) {
        reject(new Error(`ImageMagick WASM failed: ${err.message}`));
      }
    });
  }

  // 6. Native HTML5 Canvas Pipeline (PNG, JPG, WEBP, SVG, GIF, BMP, ICO)
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    const url = URL.createObjectURL(file);
    image.onload = () => { URL.revokeObjectURL(url); resolve(image); };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Failed to load ${sourceExt.toUpperCase()} natively. Formatting unsupported.`));
    };
    image.src = url;
  });

  const canvas = document.createElement('canvas');
  // ICO's width/height fields are 1 byte each, so cap the raster at 256px.
  const scale = targetExt === 'ico' ? Math.min(1, 256 / Math.max(img.width, img.height)) : 1;
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context not available');

  let mimeType = 'image/png';
  if (targetExt === 'jpg' || targetExt === 'jpeg') mimeType = 'image/jpeg';
  else if (targetExt === 'webp') mimeType = 'image/webp';
  else if (targetExt === 'gif') mimeType = 'image/gif';
  else if (targetExt === 'bmp') mimeType = 'image/bmp';

  // If converting to JPG, fill with white background as JPG doesn't support transparency
  if (mimeType === 'image/jpeg') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const rasterBlob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('Canvas toBlob failed')), mimeType, 0.95);
  });

  if (targetExt === 'ico') {
    return wrapPngAsIco(rasterBlob, Math.max(canvas.width, canvas.height));
  }
  return rasterBlob;
}
