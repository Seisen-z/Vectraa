/**
 * Sidebar.tsx — icon-library browse rail, modeled directly on Lucide's own
 * icon browser sidebar: a boxed Customizer card, a lightweight secondary
 * toggle below it, a View switch, then the category list.
 */
import React, { useEffect, useRef, useState } from 'react';
import { CATEGORIES } from '@/data/categories';
import { useIconStore } from '@/store/useIconStore';

interface Props { mobileOpen: boolean; onMobileClose: () => void; }

export default function Sidebar({ mobileOpen, onMobileClose }: Props) {
  const {
    activeCategory, setCategory,
    browseView, setBrowseView, manifest, iconColor, setIconColor, showBorder, setShowBorder,
    borderWidth, setBorderWidth,
  } = useIconStore();

  const totalCount = manifest.length;
  const countMap: Record<string, number> = {};
  for (const icon of manifest) countMap[icon.c] = (countMap[icon.c] ?? 0) + 1;

  const selectAll = () => { setBrowseView('all'); onMobileClose(); };
  const selectCategory = (id: string) => { setCategory(id); onMobileClose(); };

  // The native color input can fire onChange dozens of times per second
  // while dragging, and every store write re-renders every visible icon
  // card (hundreds, once overscan is counted). requestAnimationFrame alone
  // still allows ~60 of those full-grid re-renders per second, which is
  // exactly what drops frames. Keep the swatch itself instantly responsive
  // via local state, but throttle the actual store write — and therefore
  // the grid re-render — to a rate a color preview doesn't need to exceed.
  const COLOR_THROTTLE_MS = 80;
  const [localColor, setLocalColor] = useState(iconColor);
  useEffect(() => setLocalColor(iconColor), [iconColor]);
  const lastCommitRef = useRef(0);
  const pendingColorRef = useRef<string | null>(null);
  const throttleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleColorChange = (value: string) => {
    setLocalColor(value);
    const now = Date.now();
    const elapsed = now - lastCommitRef.current;
    if (elapsed >= COLOR_THROTTLE_MS) {
      lastCommitRef.current = now;
      setIconColor(value);
      return;
    }
    pendingColorRef.current = value;
    if (throttleTimerRef.current === null) {
      throttleTimerRef.current = setTimeout(() => {
        throttleTimerRef.current = null;
        lastCommitRef.current = Date.now();
        if (pendingColorRef.current !== null) {
          setIconColor(pendingColorRef.current);
          pendingColorRef.current = null;
        }
      }, COLOR_THROTTLE_MS - elapsed);
    }
  };
  const swatch = localColor || '#FFFFFF';

  // Same throttling approach for the border-width slider — dragging fires
  // onChange continuously, and each write re-renders every visible card.
  const BORDER_THROTTLE_MS = 80;
  const [localBorderWidth, setLocalBorderWidth] = useState(borderWidth);
  useEffect(() => setLocalBorderWidth(borderWidth), [borderWidth]);
  const borderLastCommitRef = useRef(0);
  const borderPendingRef = useRef<number | null>(null);
  const borderTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleBorderWidthChange = (value: number) => {
    setLocalBorderWidth(value);
    const now = Date.now();
    const elapsed = now - borderLastCommitRef.current;
    if (elapsed >= BORDER_THROTTLE_MS) {
      borderLastCommitRef.current = now;
      setBorderWidth(value);
      return;
    }
    borderPendingRef.current = value;
    if (borderTimerRef.current === null) {
      borderTimerRef.current = setTimeout(() => {
        borderTimerRef.current = null;
        borderLastCommitRef.current = Date.now();
        if (borderPendingRef.current !== null) {
          setBorderWidth(borderPendingRef.current);
          borderPendingRef.current = null;
        }
      }, BORDER_THROTTLE_MS - elapsed);
    }
  };

  const content = (
    <aside className="flex flex-col h-full bg-[var(--bg-sidebar)] border-r border-[var(--border-subtle)] w-60 shrink-0 overflow-hidden text-[13px]">
      <div className="overflow-y-auto no-scrollbar flex-1 px-4 pt-5 pb-4">

        {/* ── Customizer card ─────────────────────────────── */}
        <div className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] p-4 mb-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-[var(--text-primary)]">Customizer</h3>
            <button
              onClick={() => { setIconColor(''); setShowBorder(true); setBorderWidth(1.5); }}
              aria-label="Reset customizer"
              className="w-6 h-6 flex items-center justify-center rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/5 transition-colors"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 4v6h-6"/><path d="M1 20v-6h6"/>
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
              </svg>
            </button>
          </div>

          <p className="text-xs text-[var(--text-secondary)] mb-2">Color</p>
          <label className="flex items-center gap-2.5 cursor-pointer mb-4">
            <span
              className="relative w-7 h-7 rounded-md shrink-0 border border-white/15 overflow-hidden"
              style={{ background: swatch }}
            >
              <input
                type="color"
                value={swatch}
                onChange={e => handleColorChange(e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </span>
            <span className="text-xs font-mono text-[var(--text-secondary)] uppercase">{swatch}</span>
            {iconColor && (
              <button
                onClick={e => { e.preventDefault(); setIconColor(''); }}
                className="ml-auto text-[10px] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                Clear
              </button>
            )}
          </label>

          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-[var(--text-secondary)]">Border width</p>
            <span className="text-[11px] font-mono text-[var(--text-muted)]">{localBorderWidth}px</span>
          </div>
          <input
            type="range"
            min={0.5}
            max={4}
            step={0.25}
            value={localBorderWidth}
            onChange={e => handleBorderWidthChange(parseFloat(e.target.value))}
            disabled={!showBorder}
            className="w-full accent-[var(--accent)] disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Border width"
          />
          <p className="text-[10px] text-[var(--text-muted)] mt-1 mb-4">
            {showBorder ? 'Card border ring thickness' : 'Enable border to use this'}
          </p>

          <p className="text-xs text-[var(--text-secondary)] mb-2">Border</p>
          <button
            onClick={() => setShowBorder(!showBorder)}
            aria-label="Toggle border"
            className="relative w-9 h-5 rounded-full transition-colors"
            style={{ background: showBorder ? 'var(--accent)' : 'rgba(255,255,255,0.15)' }}
          >
            <span
              className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all"
              style={{ left: showBorder ? '18px' : '2px' }}
            />
          </button>
        </div>

        {/* ── View ─────────────────────────────────────────── */}
        <div className="mb-1">
          <p className="text-base font-bold text-[var(--text-primary)] mb-3">View</p>
          <div className="flex flex-col gap-3">
            <button
              onClick={selectAll}
              className={`text-left text-sm transition-colors ${browseView === 'all' ? 'text-[var(--accent)] font-bold' : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'}`}
            >
              All
            </button>
            <button
              onClick={() => setBrowseView('categories')}
              className={`text-left text-sm transition-colors ${browseView === 'categories' ? 'text-[var(--accent)] font-bold' : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'}`}
            >
              Categories
            </button>
          </div>
          {browseView === 'all' && (
            <p className="mt-3 text-[11px] text-[var(--text-muted)]">{totalCount.toLocaleString()} icons total</p>
          )}
        </div>

        {/* ── Category list — always visible; clicking a category jumps
             into the grouped view and scrolls to that section ────── */}
        <nav className="mt-2">
          {CATEGORIES.filter(c => c.id !== 'all').map(cat => {
            const isActive = browseView === 'categories' && activeCategory === cat.id;
            const count = countMap[cat.id] ?? 0;
            return (
              <button
                key={cat.id}
                onClick={() => selectCategory(cat.id)}
                title={cat.description}
                className="relative w-full flex items-center justify-between gap-2 pl-3 pr-1 py-[5px] text-left"
              >
                {isActive && <span className="absolute left-0 top-0 bottom-0 w-[3px] rounded-full bg-[var(--accent)]" />}
                <span className={`truncate transition-colors ${isActive ? 'text-[var(--text-primary)] font-medium' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>
                  {cat.label}
                </span>
                <span className="text-[11px] tabular-nums text-[var(--text-muted)] shrink-0">{count}</span>
              </button>
            );
          })}
        </nav>
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
