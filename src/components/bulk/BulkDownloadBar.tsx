/**
 * BulkDownloadBar.tsx — updated to use manifest-based selection.
 */
import React, { useState } from 'react';
import { useIconStore } from '@/store/useIconStore';
import { bulkDownloadZip } from '@/utils/download';

export default function BulkDownloadBar() {
  const { selectedIds, iconsById, filteredManifest, manifest, clearSelection, selectAll, ensureChunksLoaded, iconColor, showBorder } = useIconStore();
  const [progress, setProgress] = useState<number | null>(null);
  const count = selectedIds.size;
  if (count === 0) return null;

  async function handleBulkDownload() {
    // Ensure all selected icons' chunks are loaded
    const selectedManifest = manifest.filter(m => selectedIds.has(m.id));
    const chunks = [...new Set(selectedManifest.map(m => m.k))];
    setProgress(0);
    await ensureChunksLoaded(chunks);

    const selectedIcons = [...selectedIds].map(id => iconsById.get(id)).filter(Boolean) as any[];
    if (!selectedIcons.length) { setProgress(null); return; }

    await bulkDownloadZip(selectedIcons, (pct) => setProgress(pct), iconColor, showBorder);
    setProgress(null);
    clearSelection();
  }

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 px-5 py-3 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-medium)] shadow-2xl backdrop-blur-md animate-slide-up">
      <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold bg-[var(--neon-blue)] text-black shrink-0">{count}</span>
      <span className="text-sm font-medium text-[var(--text-primary)]">icon{count !== 1 ? 's' : ''} selected</span>
      <div className="w-px h-5 bg-[var(--border-medium)]" />
      <button onClick={selectAll} className="text-xs text-[var(--text-secondary)] hover:text-[var(--neon-blue)] transition-colors font-medium whitespace-nowrap">
        Select all ({filteredManifest.length.toLocaleString()})
      </button>
      <div className="w-px h-5 bg-[var(--border-medium)]" />
      <button onClick={clearSelection} className="text-[var(--text-secondary)] hover:text-[var(--neon-red)] transition-colors" aria-label="Clear">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
      {progress !== null && (
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
          <div className="h-full bg-[var(--neon-blue)]/10 transition-all duration-200" style={{ width: `${progress}%` }} />
        </div>
      )}
      <button onClick={handleBulkDownload} disabled={progress !== null} className="btn btn-primary disabled:opacity-60 disabled:cursor-not-allowed">
        {progress !== null ? (
          <><div className="w-3.5 h-3.5 border-2 border-black/40 border-t-black rounded-full animate-spin" />{progress}%</>
        ) : (
          <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 15V3M7 10l5 5 5-5M19 21H5"/></svg>Download ZIP</>
        )}
      </button>
    </div>
  );
}
