/**
 * iconTypes.ts
 * Core type definitions for the icon library data layer.
 * Every icon entry, regardless of source, must conform to IconEntry.
 */

/** Available style variants across icon sources */
export type IconStyle = 'outline' | 'filled' | 'bold' | 'thin' | 'duotone' | 'glyph';

/** Available neon border color keys */
export type NeonColor =
  | 'pink' | 'purple' | 'blue' | 'green' | 'orange'
  | 'yellow' | 'red' | 'cyan' | 'violet' | 'lime' | 'white' | 'black';

export const NEON_HEX: Record<string, string> = {
  pink:   '#FF2D78',
  purple: '#BE00FF',
  blue:   '#00B4FF',
  green:  '#00FF87',
  orange: '#FF6B00',
  yellow: '#FFE600',
  red:    '#FF2525',
  cyan:   '#00FFFF',
  violet: '#7B2FFF',
  lime:   '#AAFF00',
  white:  '#FFFFFF',
  black:  '#000000',
};

/** Icon source library identifier */
export type IconSource =
  | 'custom'
  | 'lucide'
  | 'tabler'
  | 'phosphor'
  | 'bootstrap'
  | 'heroicons'
  | 'iconoir'
  | 'material';

/**
 * Core icon entry — the atomic unit of the icon library.
 * This structure is stored in the generated index.json.
 */
export interface IconEntry {
  /** Globally unique identifier: "{source}-{style}-{slug}" */
  id: string;

  /** Human-readable display name, title-cased */
  name: string;

  /** URL-safe slug for file naming */
  slug: string;

  /** Logical category for sidebar filtering */
  category: string;

  /** Searchable tags array */
  tags: string[];

  /** Style variant of this icon */
  style: IconStyle;

  /** Which icon library this came from */
  source: IconSource;

  /** Raw SVG string (inner content, no <svg> wrapper) */
  svgContent: string;

  /** ViewBox attribute value, e.g. "0 0 24 24" */
  viewBox: string;

  /** Assigned neon border color key */
  color: NeonColor;
}

/**
 * The top-level structure of the generated index.json
 */
export interface IconIndex {
  version: string;
  generatedAt: string;
  totalCount: number;
  icons: IconEntry[];
}

/**
 * Download format options
 */
export type DownloadFormat = 'svg' | 'png' | 'jpg' | 'webp' | 'ico' | 'json';

export type PngSize = 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096;

/**
 * Download request
 */
export interface DownloadRequest {
  icon: IconEntry;
  format: DownloadFormat;
  pngSize?: PngSize;
}

/**
 * Bulk download request
 */
export interface BulkDownloadRequest {
  icons: IconEntry[];
  formats: DownloadFormat[];
  pngSizes?: PngSize[];
}
