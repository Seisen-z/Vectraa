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

  // 5. ImageMagick Pipeline (PSD, RAW, TIFF, EXR, etc)
  if (MAGICK_FORMATS.includes(sourceExt)) {
    await initMagick();
    const arrayBuffer = await file.arrayBuffer();
    
    let mFormat: MagickFormat = MagickFormat.Png;
    if (targetExt === 'jpg' || targetExt === 'jpeg') mFormat = MagickFormat.Jpeg;
    else if (targetExt === 'webp') mFormat = MagickFormat.WebP;
    else if (targetExt === 'gif') mFormat = MagickFormat.Gif;
    else if (targetExt === 'bmp') mFormat = MagickFormat.Bmp;
    else if (targetExt === 'ico') mFormat = MagickFormat.Ico;
    else if (targetExt === 'tiff' || targetExt === 'tif') mFormat = MagickFormat.Tiff;
    
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
  return new Promise((resolve, reject) => {
    let mimeType = 'image/png';
    if (targetExt === 'jpg' || targetExt === 'jpeg') mimeType = 'image/jpeg';
    else if (targetExt === 'webp') mimeType = 'image/webp';
    else if (targetExt === 'gif') mimeType = 'image/gif'; 
    else if (targetExt === 'bmp') mimeType = 'image/bmp'; 

    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Canvas context not available'));

      // If converting to JPG, fill with white background as JPG doesn't support transparency
      if (mimeType === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0);

      canvas.toBlob(blob => {
        if (!blob) return reject(new Error('Canvas toBlob failed'));
        resolve(blob);
      }, mimeType, 0.95);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Failed to load ${sourceExt.toUpperCase()} natively. Formatting unsupported.`));
    };

    img.src = url;
  });
}
