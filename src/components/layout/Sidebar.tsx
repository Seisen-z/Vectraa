import React from 'react';
import { CATEGORIES } from '@/data/categories';
import { useIconStore } from '@/store/useIconStore';

const COLOR_PRESETS = [
  '#FF2D78', '#BE00FF', '#00B4FF', '#00FF87',
  '#FF6B00', '#FFE600', '#FF2525', '#00FFFF',
  '#7B2FFF', '#AAFF00', '#FFFFFF', '#000000',
];

interface Props { mobileOpen: boolean; onMobileClose: () => void; }

export default function Sidebar({ mobileOpen, onMobileClose }: Props) {
  const {
    activeCategory, setCategory, manifest,
    iconColor, setIconColor, showBorder, setShowBorder,
  } = useIconStore();

  const countMap: Record<string, number> = { all: manifest.length };
  for (const icon of manifest) countMap[icon.c] = (countMap[icon.c] ?? 0) + 1;

  const displayCount = (id: string) => {
    const n = countMap[id] ?? 0;
    return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n;
  };

  const content = (
    <aside className="flex flex-col h-full bg-[var(--bg-sidebar)] border-r border-[var(--border-subtle)] w-56 shrink-0 overflow-hidden">

      {/* ── Customizer ─────────────────────────────────── */}
      <div className="p-4 border-b border-[var(--border-subtle)]">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-semibold text-[var(--text-primary)]">Customizer</p>
          {iconColor && (
            <button
              onClick={() => setIconColor('')}
              className="text-[10px] text-[var(--text-muted)] hover:text-[var(--neon-red)] transition-colors"
            >
              Reset
            </button>
          )}
        </div>

        {/* Color row */}
        <div className="flex items-center gap-2.5 mb-3">
          <span className="text-[11px] text-[var(--text-muted)] w-10 shrink-0">Color</span>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <input
              type="color"
              value={iconColor || '#00B4FF'}
              onChange={e => setIconColor(e.target.value)}
              className="w-7 h-7 rounded-lg cursor-pointer border border-white/10 bg-transparent shrink-0"
            />
            <span className="text-[11px] font-mono text-[var(--text-muted)] truncate">
              {iconColor || '#00B4FF'}
            </span>
          </div>
        </div>

        {/* Color swatches */}
        <div className="grid grid-cols-6 gap-1.5 mb-4">
          {COLOR_PRESETS.map(hex => (
            <button
              key={hex}
              onClick={() => setIconColor(hex === iconColor ? '' : hex)}
              title={hex}
              className="w-7 h-7 rounded-md transition-transform hover:scale-110"
              style={{
                background: hex,
                boxShadow: iconColor === hex ? `0 0 0 2px var(--bg-sidebar), 0 0 0 3.5px ${hex}` : 'none',
                outline: hex === '#FFFFFF' ? '1px solid rgba(128,128,128,0.25)' : 'none',
              }}
            />
          ))}
        </div>

        {/* Border toggle */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-[var(--text-muted)]">Border</span>
          <button
            onClick={() => setShowBorder(!showBorder)}
            aria-label="Toggle border"
            className="relative w-9 h-5 rounded-full transition-colors"
            style={{ background: showBorder ? 'var(--neon-blue)' : 'rgba(255,255,255,0.12)' }}
          >
            <span
              className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all shadow-sm"
              style={{ left: showBorder ? '18px' : '2px' }}
            />
          </button>
        </div>
      </div>

      {/* ── Browse ─────────────────────────────────────── */}
      <div className="px-4 py-3 border-b border-[var(--border-subtle)]">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Browse</p>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar py-2 px-2">
        {CATEGORIES.map(cat => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => { setCategory(cat.id); onMobileClose(); }}
              title={cat.description}
              className={`
                w-full text-left px-3 py-2 rounded-lg mb-0.5
                flex items-center justify-between gap-2
                transition-all duration-150
                ${isActive
                  ? 'bg-[var(--neon-blue)]/10 text-[var(--neon-blue)]'
                  : 'text-[var(--text-secondary)] hover:bg-white/5 hover:text-[var(--text-primary)]'}
              `}
            >
              <span className="text-xs font-medium truncate">{cat.label}</span>
              <span className={`text-[10px] shrink-0 tabular-nums ${isActive ? 'text-[var(--neon-blue)]/70' : 'text-[var(--text-muted)]'}`}>
                {displayCount(cat.id)}
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );

  return (
    <>
      <div className="hidden md:flex h-full">{content}</div>
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onMobileClose} />
          <div className="relative flex h-full">{content}</div>
        </div>
      )}
    </>
  );
}
