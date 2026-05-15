/**
 * search.ts — Fast fuzzy search using Fuse.js with score thresholding.
 */
import Fuse from 'fuse.js';
import type { IconEntry } from '@/data/iconTypes';

let fuseInstance: Fuse<IconEntry> | null = null;

/** Build/rebuild the Fuse index when icon data changes */
export function buildSearchIndex(icons: IconEntry[]): void {
  fuseInstance = new Fuse(icons, {
    keys: [
      { name: 'name',     weight: 0.5 },
      { name: 'tags',     weight: 0.3 },
      { name: 'category', weight: 0.15 },
      { name: 'source',   weight: 0.05 },
    ],
    threshold: 0.35,      // 0 = exact, 1 = anything matches
    includeScore: true,
    minMatchCharLength: 2,
    shouldSort: true,
    useExtendedSearch: false,
  });
}

/** Run a fuzzy search. Returns sorted results. */
export function fuzzySearch(query: string, icons: IconEntry[]): IconEntry[] {
  if (!query.trim()) return icons;
  if (!fuseInstance) buildSearchIndex(icons);
  const results = fuseInstance!.search(query.trim());
  return results.map(r => r.item);
}

/** Rebuild index when the full icon list changes */
export function invalidateSearchIndex(): void {
  fuseInstance = null;
}
