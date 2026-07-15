/**
 * IconGrid.tsx — two browse modes:
 *  - 'all'        : one continuous flat virtualized grid (no headers)
 *  - 'categories' : virtualized list grouped by category, with section
 *                    headers; clicking a category in the sidebar scrolls here
 */
import React, { useCallback, useRef, useState, useEffect, useMemo, memo } from 'react';
import { FixedSizeGrid as Grid, VariableSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { CATEGORIES, type Category } from '@/data/categories';
import { useIconStore, type ManifestEntry } from '@/store/useIconStore';
import IconCard from './IconCard';
import IconModal from './IconModal';

// Card = 72px + 9px label + gaps
const CELL_W = 96;
const CELL_H = 104;
const HEADER_H = 40;

interface CellData {
  manifest: ManifestEntry[];
  columnCount: number;
  onOpenModal: (e: ManifestEntry) => void;
}

const Cell = memo(({ columnIndex, rowIndex, style, data }: {
  columnIndex: number; rowIndex: number;
  style: React.CSSProperties; data: CellData;
}) => {
  const idx   = rowIndex * data.columnCount + columnIndex;
  const entry = data.manifest[idx];
  if (!entry) return null;

  return (
    <div style={{ ...style, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <IconCard entry={entry} onOpenModal={data.onOpenModal} />
    </div>
  );
});
Cell.displayName = 'GridCell';

type GroupedRow =
  | { type: 'header'; category: Category; count: number }
  | { type: 'icons'; entries: ManifestEntry[] };

function buildGroupedRows(manifest: ManifestEntry[], cols: number) {
  const rows: GroupedRow[] = [];
  const headerIndexByCategory: Record<string, number> = {};
  for (const cat of CATEGORIES) {
    if (cat.id === 'all') continue;
    const items = manifest.filter(m => m.c === cat.id);
    if (!items.length) continue;
    headerIndexByCategory[cat.id] = rows.length;
    rows.push({ type: 'header', category: cat, count: items.length });
    for (let i = 0; i < items.length; i += cols) {
      rows.push({ type: 'icons', entries: items.slice(i, i + cols) });
    }
  }
  return { rows, headerIndexByCategory };
}

function GroupedRowRenderer({ index, style, data }: {
  index: number; style: React.CSSProperties;
  data: { rows: GroupedRow[]; onOpenModal: (e: ManifestEntry) => void };
}) {
  const row = data.rows[index];
  if (row.type === 'header') {
    return (
      <div style={style} className="flex items-baseline gap-2 px-1 pb-2 pt-4">
        <h3 className="text-sm font-bold text-[var(--text-primary)]">{row.category.label}</h3>
        <span className="text-[11px] text-[var(--text-muted)]">{row.count.toLocaleString()}</span>
      </div>
    );
  }
  return (
    <div style={{ ...style, display: 'flex' }}>
      {row.entries.map(entry => (
        <div key={entry.id} style={{ width: CELL_W, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <IconCard entry={entry} onOpenModal={data.onOpenModal} />
        </div>
      ))}
    </div>
  );
}

export default function IconGrid() {
  const {
    filteredManifest, isLoading, loadError, ensureChunksLoaded,
    browseView, scrollToCategoryId, clearScrollToCategory,
  } = useIconStore();
  const [modalEntry, setModalEntry] = useState<ManifestEntry | null>(null);
  const gridRef = useRef<Grid>(null);
  const listRef = useRef<List>(null);

  useEffect(() => {
    gridRef.current?.scrollTo({ scrollLeft: 0, scrollTop: 0 });
  }, [filteredManifest, browseView]);

  const handleOpenModal = useCallback((entry: ManifestEntry) => setModalEntry(entry), []);

  const handleItemsRendered = useCallback(({
    overscanRowStartIndex, overscanRowStopIndex, columnCount,
  }: { overscanRowStartIndex: number; overscanRowStopIndex: number; columnCount?: number }) => {
    const cols  = columnCount ?? 1;
    const start = overscanRowStartIndex * cols;
    const stop  = (overscanRowStopIndex + 1) * cols; // exclusive end — covers the full last row
    const chunks = [...new Set(filteredManifest.slice(start, stop).map(e => e.k))];
    ensureChunksLoaded(chunks);
  }, [filteredManifest, ensureChunksLoaded]);

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center h-full gap-4 text-[var(--text-muted)]">
      <div className="w-10 h-10 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
      <p className="text-sm font-medium">Loading icon library…</p>
    </div>
  );

  if (loadError) return (
    <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-6">
      <div className="text-4xl">⚠️</div>
      <p className="font-semibold" style={{ color: 'var(--neon-red)' }}>Failed to load icons</p>
      <p className="text-sm text-[var(--text-muted)] max-w-sm">{loadError}</p>
      <p className="text-xs text-[var(--text-muted)] mt-1">
        Run <code className="bg-white/5 px-1.5 py-0.5 rounded font-mono">npm run generate-icons</code> then restart.
      </p>
    </div>
  );

  if (filteredManifest.length === 0) return (
    <div className="flex flex-col items-center justify-center h-full gap-3 text-[var(--text-muted)]">
      <div className="text-5xl">🔍</div>
      <p className="text-base font-medium text-[var(--text-primary)]">No icons found</p>
      <p className="text-sm">Try a different search term or category</p>
    </div>
  );

  return (
    <>
      <AutoSizer>
        {({ width, height }) => {
          const columnCount = Math.max(1, Math.floor(width / CELL_W));

          if (browseView === 'all') {
            const rowCount = Math.ceil(filteredManifest.length / columnCount);
            return (
              <Grid
                ref={gridRef}
                columnCount={columnCount}
                columnWidth={CELL_W}
                rowCount={rowCount}
                rowHeight={CELL_H}
                width={width}
                height={height}
                itemData={{ manifest: filteredManifest, columnCount, onOpenModal: handleOpenModal }}
                overscanRowCount={4}
                onItemsRendered={({ overscanRowStartIndex, overscanRowStopIndex }) =>
                  handleItemsRendered({ overscanRowStartIndex, overscanRowStopIndex, columnCount })
                }
              >
                {Cell}
              </Grid>
            );
          }

          return (
            <GroupedGrid
              listRef={listRef}
              manifest={filteredManifest}
              columnCount={columnCount}
              width={width}
              height={height}
              onOpenModal={handleOpenModal}
              ensureChunksLoaded={ensureChunksLoaded}
              scrollToCategoryId={scrollToCategoryId}
              clearScrollToCategory={clearScrollToCategory}
            />
          );
        }}
      </AutoSizer>

      {modalEntry && <IconModal entry={modalEntry} onClose={() => setModalEntry(null)} />}
    </>
  );
}

function GroupedGrid({
  listRef, manifest, columnCount, width, height, onOpenModal, ensureChunksLoaded,
  scrollToCategoryId, clearScrollToCategory,
}: {
  listRef: React.RefObject<List>;
  manifest: ManifestEntry[];
  columnCount: number;
  width: number;
  height: number;
  onOpenModal: (e: ManifestEntry) => void;
  ensureChunksLoaded: (chunks: number[]) => void;
  scrollToCategoryId: string | null;
  clearScrollToCategory: () => void;
}) {
  const { rows, headerIndexByCategory } = useMemo(
    () => buildGroupedRows(manifest, columnCount),
    [manifest, columnCount]
  );

  useEffect(() => {
    if (!scrollToCategoryId) return;
    const idx = headerIndexByCategory[scrollToCategoryId];
    if (idx !== undefined) listRef.current?.scrollToItem(idx, 'start');
    clearScrollToCategory();
  }, [scrollToCategoryId, headerIndexByCategory, listRef, clearScrollToCategory]);

  const getItemSize = useCallback((index: number) => rows[index]?.type === 'header' ? HEADER_H : CELL_H, [rows]);

  const handleItemsRendered = useCallback(({ overscanStartIndex, overscanStopIndex }: { overscanStartIndex: number; overscanStopIndex: number }) => {
    const chunks = new Set<number>();
    for (let i = overscanStartIndex; i <= overscanStopIndex; i++) {
      const row = rows[i];
      if (row?.type === 'icons') row.entries.forEach(e => chunks.add(e.k));
    }
    ensureChunksLoaded([...chunks]);
  }, [rows, ensureChunksLoaded]);

  return (
    <List
      ref={listRef}
      itemCount={rows.length}
      itemSize={getItemSize}
      width={width}
      height={height}
      itemData={{ rows, onOpenModal }}
      overscanCount={3}
      onItemsRendered={handleItemsRendered}
    >
      {GroupedRowRenderer}
    </List>
  );
}
