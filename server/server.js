import express from 'express';
import cors from 'cors';
import multer from 'multer';
import mammoth from 'mammoth';
import puppeteer from 'puppeteer';
import * as xlsx from 'xlsx';
import { marked } from 'marked';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

const app = express();
app.use(cors());

// Use memory storage for quick conversions without hitting disk
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } }); // 50MB limit

app.post('/api/convert', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const sourceFormat = req.body.sourceFormat?.toLowerCase();
    const targetFormat = req.body.targetFormat?.toLowerCase();

    console.log(`[CONVERSION REQUEST] ${sourceFormat?.toUpperCase()} -> ${targetFormat?.toUpperCase()}`);

    // ── PUPPETEER PDF RENDER HELPER ──
    const renderPDF = async (htmlContent, landscape = false) => {
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
      const pdfBuffer = await page.pdf({ 
        format: 'A4', 
        printBackground: true, 
        landscape: landscape,
        margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' } 
      });
      await browser.close();
      return pdfBuffer;
    };

    // ── DOCX to PDF ──
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

    // ── SPREADSHEETS (XLSX, CSV, ODS) to PDF / CSV / XLSX ──
    if (['xlsx', 'xls', 'csv', 'ods'].includes(sourceFormat)) {
      const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      if (targetFormat === 'pdf') {
        const htmlTable = xlsx.utils.sheet_to_html(worksheet);
        const htmlContent = `
          <html><head><style>
            body { font-family: sans-serif; padding: 20px; }
            table { border-collapse: collapse; width: 100%; font-size: 12px; }
            th, td { border: 1px solid #ccc; padding: 6px; text-align: left; }
            th { background-color: #f4f4f4; }
          </style></head><body>${htmlTable}</body></html>`;
        const pdfBuffer = await renderPDF(htmlContent, true); // landscape for wide tables
        res.setHeader('Content-Type', 'application/pdf');
        return res.send(pdfBuffer);
      }
      
      if (targetFormat === 'csv') {
        const csvData = xlsx.utils.sheet_to_csv(worksheet);
        res.setHeader('Content-Type', 'text/csv');
        return res.send(csvData);
      }
      
      if (targetFormat === 'xlsx') {
        const outBuffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        return res.send(outBuffer);
      }
    }

    // ── MARKDOWN / TEXT / JSON / HTML to PDF ──
    if (['md', 'txt', 'html', 'json', 'xml'].includes(sourceFormat) && targetFormat === 'pdf') {
      const textContent = req.file.buffer.toString('utf-8');
      let htmlContent = '';
      
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
      } 
      else if (sourceFormat === 'html') {
        htmlContent = textContent; // Direct render for HTML
      }
      else {
        // Code/Text formatting
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

    // ── PDF to TXT ──
    if (sourceFormat === 'pdf' && targetFormat === 'txt') {
      const data = await pdfParse(req.file.buffer);
      res.setHeader('Content-Type', 'text/plain');
      return res.send(data.text);
    }

    // ── FALLBACK ERROR FOR IMPOSSIBLE ROUTES ──
    return res.status(400).json({ 
      error: `Backend conversion for ${sourceFormat?.toUpperCase()} to ${targetFormat?.toUpperCase()} requires a proprietary rendering engine (like Microsoft Office) and cannot be accurately performed with open-source local software. Please use a cloud API for this specific conversion.` 
    });

  } catch (error) {
    console.error('Conversion Error:', error);
    res.status(500).json({ error: error.message || 'Internal server error during conversion' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 VaultCore Universal Bridge Server running on http://localhost:${PORT}`);
});
