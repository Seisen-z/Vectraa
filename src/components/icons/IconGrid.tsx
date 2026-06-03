/**
 * IconGrid.tsx — Updated cell size to match new 88px card + label layout.
 */
import React, { useCallback, useRef, useState, useEffect, memo } from 'react';
import { FixedSizeGrid as Grid } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import type { IconEntry } from '@/data/iconTypes';
import { useIconStore, type ManifestEntry } from '@/store/useIconStore';
import IconCard from './IconCard';
import IconModal from './IconModal';

// Card = 72px + 9px label + gaps
const CELL_W = 96;
const CELL_H = 104;

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
    <div style={{
      ...style,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <IconCard entry={entry} onOpenModal={data.onOpenModal} />
    </div>
  );
});
Cell.displayName = 'GridCell';

export default function IconGrid() {
  const { filteredManifest, isLoading, loadError, ensureChunksLoaded } = useIconStore();
  const [modalEntry, setModalEntry] = useState<ManifestEntry | null>(null);
  const gridRef = useRef<Grid>(null);

  useEffect(() => {
    gridRef.current?.scrollTo({ scrollLeft: 0, scrollTop: 0 });
  }, [filteredManifest]);

  const handleOpenModal = useCallback((entry: ManifestEntry) => setModalEntry(entry), []);

  const handleItemsRendered = useCallback(({
    overscanRowStartIndex, overscanRowStopIndex, columnCount,
  }: { overscanRowStartIndex: number; overscanRowStopIndex: number; columnCount?: number }) => {
    const cols  = columnCount ?? 1;
    const start = overscanRowStartIndex * cols;
    const stop  = overscanRowStopIndex  * cols;
    const chunks = [...new Set(filteredManifest.slice(start, stop + 1).map(e => e.k))];
    ensureChunksLoaded(chunks);
  }, [filteredManifest, ensureChunksLoaded]);

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center h-full gap-4 text-[var(--text-muted)]">
      <div className="w-10 h-10 border-2 border-[var(--neon-blue)] border-t-transparent rounded-full animate-spin" />
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
          const rowCount    = Math.ceil(filteredManifest.length / columnCount);

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
        }}
      </AutoSizer>

      {modalEntry && <IconModal entry={modalEntry} onClose={() => setModalEntry(null)} />}
    </>
  );
}
