/**
 * useIconStore.ts — v5: no style field in manifest, cleaner filters.
 */
import { create } from 'zustand';
import type { IconEntry } from '@/data/iconTypes';

/** Lean manifest entry — short keys matching generator v5 */
export interface ManifestEntry {
  id: string;
  n:  string;   // name
  c:  string;   // category
  l:  string;   // neon colour key
  k:  number;   // chunk index
}

interface IconState {
  manifest:         ManifestEntry[];
  iconsById:        Map<string, IconEntry>;
  loadedChunks:     Set<number>;
  fetchingChunks:   Set<number>;
  filteredManifest: ManifestEntry[];
  searchQuery:      string;
  activeCategory:   string;
  isLoading:        boolean;
  loadError:        string | null;
  selectedIds:      Set<string>;
  iconColor:        string;  // global colour override (empty = per-card neon)
  showBorder:       boolean; // global border toggle

  loadManifest:         () => Promise<void>;
  ensureChunksLoaded:   (chunks: number[]) => Promise<void>;
  getIcon:              (id: string) => IconEntry | undefined;
  setSearch:            (q: string) => void;
  setCategory:          (cat: string) => void;
  setIconColor:         (color: string) => void;
  setShowBorder:        (show: boolean) => void;
  toggleSelect:         (id: string) => void;
  selectAll:            () => void;
  clearSelection:       () => void;
}

function applyFilters(manifest: ManifestEntry[], query: string, category: string): ManifestEntry[] {
  let r = manifest;
  if (category !== 'all') r = r.filter(i => i.c === category);
  if (query.trim()) {
    const q = query.toLowerCase().trim();
    r = r.filter(i => i.n.toLowerCase().includes(q) || i.c.includes(q));
  }
  return r;
}

export const useIconStore = create<IconState>((set, get) => ({
  manifest: [], iconsById: new Map(),
  loadedChunks: new Set(), fetchingChunks: new Set(),
  filteredManifest: [], searchQuery: '', activeCategory: 'all',
  isLoading: false, loadError: null, selectedIds: new Set(),
  iconColor: '', showBorder: true,

  loadManifest: async () => {
    set({ isLoading: true, loadError: null });
    try {
      const res  = await fetch('/icons/index.json');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const icons: ManifestEntry[] = (data.icons ?? []).map((r: any) => ({
        id: r.id,
        n:  r.n ?? r.name     ?? '',
        c:  r.c ?? r.category ?? 'technology',
        l:  r.l ?? r.color    ?? 'blue',
        k:  r.k ?? r.chunk    ?? 0,
      }));
      set({ manifest: icons, filteredManifest: icons, isLoading: false });
      // Pre-fetch first 4 chunks for instant above-fold rendering
      const firstChunks = [...new Set(icons.slice(0, 2000).map(m => m.k))];
      get().ensureChunksLoaded(firstChunks);
    } catch (err) {
      set({ isLoading: false, loadError: err instanceof Error ? err.message : 'Failed to load' });
    }
  },

  ensureChunksLoaded: async (nums: number[]) => {
    const { loadedChunks, fetchingChunks } = get();
    const needed = nums.filter(n => !loadedChunks.has(n) && !fetchingChunks.has(n));
    if (!needed.length) return;
    set(s => ({ fetchingChunks: new Set([...s.fetchingChunks, ...needed]) }));
    await Promise.all(needed.map(async n => {
      try {
        const res   = await fetch(`/icons/chunks/chunk-${n}.json`);
        if (!res.ok) return;
        const chunk: IconEntry[] = await res.json();
        set(s => {
          const map = new Map(s.iconsById);
          chunk.forEach(ic => map.set(ic.id, ic));
          const loaded   = new Set([...s.loadedChunks, n]);
          const fetching = new Set(s.fetchingChunks);
          fetching.delete(n);
          return { iconsById: map, loadedChunks: loaded, fetchingChunks: fetching };
        });
      } catch {
        set(s => { const f = new Set(s.fetchingChunks); f.delete(n); return { fetchingChunks: f }; });
      }
    }));
  },

  getIcon:      id    => get().iconsById.get(id),
  setSearch:    q     => { const {manifest,activeCategory}=get(); set({searchQuery:q,     filteredManifest:applyFilters(manifest,q,activeCategory)}); },
  setCategory:  cat   => { const {manifest,searchQuery}=get();    set({activeCategory:cat, filteredManifest:applyFilters(manifest,searchQuery,cat)}); },
  setIconColor: color => set({ iconColor: color }),
  setShowBorder: show => set({ showBorder: show }),

  toggleSelect:   id  => { const n=new Set(get().selectedIds); n.has(id)?n.delete(id):n.add(id); set({selectedIds:n}); },
  selectAll:      ()  => set(s=>({selectedIds:new Set(s.filteredManifest.map(i=>i.id))})),
  clearSelection: ()  => set({selectedIds:new Set()}),
}));
