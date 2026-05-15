/**
 * IconModal.tsx — Fixed for v3 ManifestEntry short keys + color support.
 */
import React, { useEffect, useCallback } from 'react';
import type { DownloadFormat, PngSize } from '@/data/iconTypes';
import { useIconStore, type ManifestEntry } from '@/store/useIconStore';
import { downloadIcon } from '@/utils/download';
import { CATEGORY_MAP } from '@/data/categories';
import { NEON_HEX } from '@/data/iconTypes';

interface Props { entry: ManifestEntry; onClose: () => void; }
const PNG_SIZES: PngSize[] = [16, 32, 64, 128, 256, 512];

export default function IconModal({ entry, onClose }: Props) {
  const { getIcon, ensureChunksLoaded, iconColor, showBorder } = useIconStore();
  const icon        = getIcon(entry.id);
  const neonColor   = NEON_HEX[entry.l] ?? '#00B4FF';
  const svgColor    = iconColor || neonColor;
  const category    = CATEGORY_MAP.get(entry.c);

  useEffect(() => { ensureChunksLoaded([entry.k]); }, [entry.k, ensureChunksLoaded]);
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  const dl = useCallback(async (fmt: DownloadFormat, size?: PngSize) => {
    if (!icon) return;
    await downloadIcon(icon, fmt, size ?? 512, svgColor, showBorder);
  }, [icon, svgColor, showBorder]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="relative w-full max-w-lg rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[var(--bg-secondary)] animate-slide-up" onClick={e => e.stopPropagation()}>
        {/* Close */}
        <button onClick={onClose} className="absolute top-4 right-4 z-10 w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors" aria-label="Close">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>

        {/* Preview */}
        <div className="flex items-center justify-center py-14 px-8" style={{ background: `radial-gradient(ellipse at center, ${neonColor}20 0%, transparent 70%)` }}>
          <div className="w-32 h-32 rounded-2xl border-2 flex items-center justify-center" style={{ borderColor: neonColor, boxShadow: `0 0 40px 8px ${neonColor}30` }}>
            {icon ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox={icon.viewBox} className="w-16 h-16" fill="currentColor" style={{ color: svgColor }} dangerouslySetInnerHTML={{ __html: icon.svgContent }} />
            ) : (
              <div className="w-10 h-10 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: neonColor }} />
            )}
          </div>
        </div>

        {/* Meta */}
        <div className="px-6 pb-2">
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">{entry.n}</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {[`${category?.label ?? entry.c}`].map(label => (
              <span key={label} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-xs text-[var(--text-secondary)] capitalize">{label.trim()}</span>
            ))}
            <span className="px-2 py-0.5 rounded-md border text-xs capitalize" style={{ borderColor: `${neonColor}60`, color: neonColor, background: `${neonColor}10` }}>
              ● {entry.l}
            </span>
          </div>
        </div>

        {/* Downloads */}
        <div className="px-6 pb-6 space-y-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-2">Vector & Data</p>
            <div className="flex gap-2 flex-wrap">
              {(['svg','ico','json'] as DownloadFormat[]).map(fmt => (
                <button key={fmt} onClick={() => dl(fmt)} disabled={!icon} className="btn btn-ghost text-xs uppercase disabled:opacity-40" style={{ minWidth: 56 }}>{fmt.toUpperCase()}</button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-2">PNG</p>
            <div className="flex gap-2 flex-wrap">
              {PNG_SIZES.map(size => (
                <button key={size} onClick={() => dl('png', size)} disabled={!icon} className="btn btn-ghost text-xs disabled:opacity-40" style={{ minWidth: 56 }}>{size}px</button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-2">Raster 512px</p>
            <div className="flex gap-2">
              {(['jpg','webp'] as DownloadFormat[]).map(fmt => (
                <button key={fmt} onClick={() => dl(fmt, 512)} disabled={!icon} className="btn btn-ghost text-xs uppercase disabled:opacity-40" style={{ minWidth: 64 }}>{fmt.toUpperCase()}</button>
              ))}
            </div>
          </div>
          {!icon && <p className="text-xs text-[var(--text-muted)] italic">Loading SVG data…</p>}
        </div>
      </div>
    </div>
  );
}
