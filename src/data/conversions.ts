export interface ConversionRoute {
  from: string;
  to: string;
}

export interface ConversionCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  routes: ConversionRoute[];
}

export const CONVERSION_CATEGORIES: ConversionCategory[] = [
  {
    id: 'raster',
    title: 'Raster Image Formats',
    description: 'Standard pixel-based image conversions',
    icon: '🖼️',
    routes: [
      { from: 'PNG', to: 'JPG' }, { from: 'PNG', to: 'JPEG' }, { from: 'PNG', to: 'WEBP' },
      { from: 'PNG', to: 'GIF' }, { from: 'PNG', to: 'BMP' }, { from: 'PNG', to: 'TIFF' },
      { from: 'PNG', to: 'TIF' }, { from: 'PNG', to: 'HEIC' }, { from: 'PNG', to: 'AVIF' },
      { from: 'PNG', to: 'JFIF' },
      
      { from: 'JPG', to: 'PNG' }, { from: 'JPG', to: 'WEBP' }, { from: 'JPG', to: 'GIF' },
      { from: 'JPG', to: 'BMP' }, { from: 'JPG', to: 'TIFF' }, { from: 'JPG', to: 'HEIC' },
      { from: 'JPG', to: 'AVIF' }, { from: 'JPG', to: 'PDF' },

      { from: 'JPEG', to: 'PNG' }, { from: 'JPEG', to: 'WEBP' }, { from: 'JPEG', to: 'GIF' },
      { from: 'JPEG', to: 'BMP' }, { from: 'JPEG', to: 'TIFF' }, { from: 'JPEG', to: 'HEIC' },
      { from: 'JPEG', to: 'AVIF' }, { from: 'JPEG', to: 'PDF' },

      { from: 'WEBP', to: 'PNG' }, { from: 'WEBP', to: 'JPG' }, { from: 'WEBP', to: 'JPEG' },
      { from: 'WEBP', to: 'GIF' }, { from: 'WEBP', to: 'BMP' }, { from: 'WEBP', to: 'TIFF' },
      { from: 'WEBP', to: 'HEIC' }, { from: 'WEBP', to: 'AVIF' }, { from: 'WEBP', to: 'PDF' },

      { from: 'GIF', to: 'PNG' }, { from: 'GIF', to: 'JPG' }, { from: 'GIF', to: 'JPEG' },
      { from: 'GIF', to: 'WEBP' }, { from: 'GIF', to: 'BMP' }, { from: 'GIF', to: 'TIFF' },
      { from: 'GIF', to: 'PDF' },

      { from: 'BMP', to: 'PNG' }, { from: 'BMP', to: 'JPG' }, { from: 'BMP', to: 'JPEG' },
      { from: 'BMP', to: 'WEBP' }, { from: 'BMP', to: 'GIF' }, { from: 'BMP', to: 'TIFF' },
      { from: 'BMP', to: 'PDF' },

      { from: 'TIFF', to: 'PNG' }, { from: 'TIFF', to: 'JPG' }, { from: 'TIFF', to: 'JPEG' },
      { from: 'TIFF', to: 'WEBP' }, { from: 'TIFF', to: 'GIF' }, { from: 'TIFF', to: 'BMP' },
      { from: 'TIFF', to: 'PDF' },

      { from: 'HEIC', to: 'PNG' }, { from: 'HEIC', to: 'JPG' }, { from: 'HEIC', to: 'JPEG' },
      { from: 'HEIC', to: 'WEBP' }, { from: 'HEIC', to: 'PDF' },

      { from: 'AVIF', to: 'PNG' }, { from: 'AVIF', to: 'JPG' }, { from: 'AVIF', to: 'JPEG' },
      { from: 'AVIF', to: 'WEBP' }, { from: 'AVIF', to: 'PDF' },
    ]
  },
  {
    id: 'vector',
    title: 'Vector Image Formats',
    description: 'Scalable graphic formats',
    icon: '📐',
    routes: [
      { from: 'SVG', to: 'PNG' }, { from: 'SVG', to: 'JPG' }, { from: 'SVG', to: 'JPEG' },
      { from: 'SVG', to: 'WEBP' }, { from: 'SVG', to: 'PDF' }, { from: 'PNG', to: 'SVG' },
      { from: 'JPG', to: 'SVG' }, { from: 'WEBP', to: 'SVG' }
    ]
  },
  {
    id: 'icon',
    title: 'Icon Formats',
    description: 'System and favicon formats',
    icon: '✨',
    routes: [
      { from: 'PNG', to: 'ICO' }, { from: 'ICO', to: 'PNG' }, { from: 'PNG', to: 'ICNS' },
      { from: 'ICNS', to: 'PNG' }, { from: 'JPG', to: 'ICO' }, { from: 'WEBP', to: 'ICO' }
    ]
  },
  {
    id: 'word',
    title: 'Word Documents',
    description: 'Microsoft Word and standard documents',
    icon: '📝',
    routes: [
      { from: 'DOC', to: 'PDF' }, { from: 'DOCX', to: 'PDF' }, { from: 'PDF', to: 'DOC' },
      { from: 'PDF', to: 'DOCX' }, { from: 'DOC', to: 'DOCX' }, { from: 'DOCX', to: 'DOC' },
      { from: 'DOC', to: 'TXT' }, { from: 'DOCX', to: 'TXT' }, { from: 'DOC', to: 'RTF' },
      { from: 'DOCX', to: 'RTF' }, { from: 'DOC', to: 'HTML' }, { from: 'DOCX', to: 'HTML' }
    ]
  },
  {
    id: 'pdf-conversions',
    title: 'PDF Conversions',
    description: 'Convert from and to PDF',
    icon: '📄',
    routes: [
      { from: 'PDF', to: 'DOC' }, { from: 'PDF', to: 'DOCX' }, { from: 'PDF', to: 'TXT' },
      { from: 'PDF', to: 'RTF' }, { from: 'PDF', to: 'HTML' }, { from: 'PDF', to: 'EPUB' },
      { from: 'PDF', to: 'MOBI' }, { from: 'PDF', to: 'AZW3' }
    ]
  },
  {
    id: 'spreadsheet',
    title: 'Spreadsheet Documents',
    description: 'Excel and data tables',
    icon: '📊',
    routes: [
      { from: 'XLS', to: 'PDF' }, { from: 'XLSX', to: 'PDF' }, { from: 'PDF', to: 'XLS' },
      { from: 'PDF', to: 'XLSX' }, { from: 'CSV', to: 'XLSX' }, { from: 'XLSX', to: 'CSV' },
      { from: 'ODS', to: 'XLSX' }, { from: 'XLSX', to: 'ODS' }, { from: 'CSV', to: 'PDF' },
      { from: 'ODS', to: 'PDF' }
    ]
  },
  {
    id: 'presentation',
    title: 'Presentation Documents',
    description: 'PowerPoint and slides',
    icon: '📽️',
    routes: [
      { from: 'PPT', to: 'PDF' }, { from: 'PPTX', to: 'PDF' }, { from: 'PDF', to: 'PPT' },
      { from: 'PDF', to: 'PPTX' }, { from: 'ODP', to: 'PPTX' }, { from: 'PPTX', to: 'ODP' },
      { from: 'PPT', to: 'PPTX' }, { from: 'PPTX', to: 'PPT' }
    ]
  },
  {
    id: 'text',
    title: 'Text Documents',
    description: 'Plain text and rich text files',
    icon: '🗒️',
    routes: [
      { from: 'TXT', to: 'PDF' }, { from: 'RTF', to: 'PDF' }, { from: 'MD', to: 'PDF' },
      { from: 'HTML', to: 'PDF' }, { from: 'TXT', to: 'DOCX' }, { from: 'RTF', to: 'DOCX' },
      { from: 'MD', to: 'DOCX' }, { from: 'HTML', to: 'DOCX' }, { from: 'PDF', to: 'TXT' },
      { from: 'PDF', to: 'RTF' }, { from: 'PDF', to: 'MD' }, { from: 'PDF', to: 'HTML' }
    ]
  },
  {
    id: 'ebook',
    title: 'eBook Documents',
    description: 'Electronic books and readers',
    icon: '📚',
    routes: [
      { from: 'EPUB', to: 'PDF' }, { from: 'PDF', to: 'EPUB' }, { from: 'MOBI', to: 'PDF' },
      { from: 'PDF', to: 'MOBI' }, { from: 'AZW3', to: 'PDF' }, { from: 'PDF', to: 'AZW3' },
      { from: 'EPUB', to: 'DOCX' }, { from: 'DOCX', to: 'EPUB' }
    ]
  },
  {
    id: 'opendocument',
    title: 'OpenDocument Formats',
    description: 'Open source office formats',
    icon: '📂',
    routes: [
      { from: 'ODT', to: 'PDF' }, { from: 'PDF', to: 'ODT' }, { from: 'ODS', to: 'PDF' },
      { from: 'PDF', to: 'ODS' }, { from: 'ODP', to: 'PDF' }, { from: 'PDF', to: 'ODP' },
      { from: 'ODT', to: 'DOCX' }, { from: 'DOCX', to: 'ODT' }
    ]
  },
  {
    id: 'web-markup',
    title: 'Web & Markup',
    description: 'Code and structured data formats',
    icon: '🌐',
    routes: [
      { from: 'HTML', to: 'PDF' }, { from: 'PDF', to: 'HTML' }, { from: 'XML', to: 'PDF' },
      { from: 'PDF', to: 'XML' }, { from: 'JSON', to: 'PDF' }, { from: 'PDF', to: 'JSON' },
      { from: 'MD', to: 'HTML' }, { from: 'HTML', to: 'MD' }
    ]
  },
  {
    id: 'publishing',
    title: 'Publishing & Pro',
    description: 'LaTeX and professional printing',
    icon: '🖨️',
    routes: [
      { from: 'LATEX', to: 'PDF' }, { from: 'TEX', to: 'PDF' }, { from: 'PDF', to: 'TEX' },
      { from: 'XPS', to: 'PDF' }, { from: 'PDF', to: 'XPS' }, { from: 'PS', to: 'PDF' },
      { from: 'PDF', to: 'PS' }
    ]
  },
  {
    id: 'design',
    title: 'Design & Editing',
    description: 'Professional project files',
    icon: '🎨',
    routes: [
      { from: 'PNG', to: 'PSD' }, { from: 'PSD', to: 'PNG' }, { from: 'PNG', to: 'XCF' },
      { from: 'XCF', to: 'PNG' }, { from: 'PNG', to: 'KRA' }, { from: 'KRA', to: 'PNG' }
    ]
  },
  {
    id: 'modern',
    title: 'Modern Web Formats',
    description: 'Highly compressed web-ready files',
    icon: '🌐',
    routes: [
      { from: 'JPG', to: 'WEBP' }, { from: 'PNG', to: 'WEBP' }, { from: 'GIF', to: 'WEBP' },
      { from: 'TIFF', to: 'WEBP' }, { from: 'WEBP', to: 'JPG' }, { from: 'WEBP', to: 'PNG' },
      { from: 'WEBP', to: 'AVIF' }, { from: 'WEBP', to: 'HEIC' }, { from: 'WEBP', to: 'JXL' }
    ]
  },
  {
    id: 'camera',
    title: 'Camera & Raw Formats',
    description: 'Uncompressed photography formats',
    icon: '📸',
    routes: [
      { from: 'RAW', to: 'JPG' }, { from: 'RAW', to: 'PNG' }, { from: 'RAW', to: 'TIFF' },
      { from: 'RAW', to: 'DNG' }, { from: 'DNG', to: 'JPG' }, { from: 'DNG', to: 'PNG' },
      { from: 'DNG', to: 'TIFF' }
    ]
  },
  {
    id: 'hdr',
    title: 'HDR & Professional',
    description: 'High dynamic range imaging',
    icon: '🎬',
    routes: [
      { from: 'PNG', to: 'EXR' }, { from: 'EXR', to: 'PNG' }, { from: 'PNG', to: 'HDR' },
      { from: 'HDR', to: 'PNG' }, { from: 'PNG', to: 'DDS' }, { from: 'DDS', to: 'PNG' },
      { from: 'PNG', to: 'TGA' }, { from: 'TGA', to: 'PNG' }
    ]
  },
  {
    id: 'animation',
    title: 'Animation Formats',
    description: 'Moving image formats',
    icon: '🎞️',
    routes: [
      { from: 'GIF', to: 'APNG' }, { from: 'APNG', to: 'GIF' }, { from: 'PNG', to: 'APNG' },
      { from: 'APNG', to: 'PNG' }, { from: 'GIF', to: 'WEBP' }, { from: 'WEBP', to: 'GIF' }
    ]
  }
];
