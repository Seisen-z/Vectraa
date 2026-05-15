/**
 * Header.tsx — With global icon color picker.
 */
import React, { useState, useRef, useEffect } from 'react';
import SearchBar from '@/components/search/SearchBar';
import { useThemeStore } from '@/store/useThemeStore';
import { useIconStore } from '@/store/useIconStore';
import { useAppStore } from '@/store/useAppStore';
import { NEON_HEX } from '@/data/iconTypes';

const COLOR_PRESETS = [
  '#FF2D78', '#BE00FF', '#00B4FF', '#00FF87', '#FF6B00',
  '#FFE600', '#FF2525', '#00FFFF', '#7B2FFF', '#AAFF00',
  '#FFFFFF', '#000000', '#FF8C42', '#5CE65C', '#42A5F5',
];

interface Props { onMobileMenuToggle: () => void; }

export default function Header({ onMobileMenuToggle }: Props) {
  const { theme, toggleTheme }          = useThemeStore();
  const { activeAppMode, setAppMode }   = useAppStore();
  const { selectedIds, clearSelection, iconColor, setIconColor, showBorder, setShowBorder } = useIconStore();
  const [showColorPicker, setShowColorPicker] = useState(false);
  const colorPickerRef = useRef<HTMLDivElement>(null);

  // Close color picker on outside click
  useEffect(() => {
    function h(e: MouseEvent) {
      if (colorPickerRef.current && !colorPickerRef.current.contains(e.target as Node))
        setShowColorPicker(false);
    }
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const activeColor = iconColor || '#00B4FF';

  return (
    <header className="
      sticky top-0 z-30 flex items-center gap-3 px-4 py-3
      bg-[var(--bg-header)] backdrop-blur-md
      border-b border-[var(--border-subtle)]
      transition-theme shrink-0
    ">
      {/* Mobile burger */}
      <button id="mobile-menu-btn" onClick={onMobileMenuToggle}
        className="md:hidden btn btn-ghost w-9 h-9 p-0 shrink-0" aria-label="Open menu">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M3 6h18M3 12h18M3 18h18"/>
        </svg>
      </button>

      {/* Logo */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-[var(--neon-blue)]/15 border border-[var(--neon-blue)]/40 flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--neon-blue)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1"/>
            <rect x="14" y="3" width="7" height="7" rx="1"/>
            <rect x="3" y="14" width="7" height="7" rx="1"/>
            <rect x="14" y="14" width="7" height="7" rx="1"/>
          </svg>
        </div>
        <span className="hidden sm:block text-base font-bold text-[var(--text-primary)] tracking-tight">
          Ikon<span style={{ color: 'var(--neon-blue)' }}>ix</span>
        </span>
      </div>

      {/* ── App Tabs ──────────────────────────────── */}
      <div className="flex bg-black/20 p-1 rounded-xl border border-white/5 mx-2 hidden md:flex">
        <button
          onClick={() => setAppMode('icons')}
          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            activeAppMode === 'icons' ? 'bg-[var(--neon-blue)]/20 text-[var(--neon-blue)]' : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          ✦ Icons
        </button>
        <button
          onClick={() => setAppMode('conversion')}
          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            activeAppMode === 'conversion' ? 'bg-[var(--neon-purple)]/20 text-[var(--neon-purple)]' : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          🔄 Conversion
        </button>
      </div>

      {/* Search */}
      <div className="flex-1 min-w-0 transition-opacity">
        {activeAppMode === 'icons' ? <SearchBar /> : <div className="h-9"></div>}
      </div>

      {/* ── Border Toggle ─────────────────────────────── */}
      {activeAppMode === 'icons' && (
        <button
          onClick={() => setShowBorder(!showBorder)}
          title={showBorder ? "Hide borders" : "Show borders"}
          className={`flex items-center justify-center w-9 h-9 rounded-xl border transition-colors shrink-0 ${
            showBorder 
              ? 'border-[var(--neon-blue)] bg-[var(--neon-blue)]/10 text-[var(--neon-blue)]' 
              : 'border-[var(--border-medium)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] text-[var(--text-secondary)]'
          }`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="4" strokeDasharray={showBorder ? "none" : "4 4"} />
          </svg>
        </button>
      )}

      {/* ── Color Picker ──────────────────────────────── */}
      {activeAppMode === 'icons' && (
        <div ref={colorPickerRef} className="relative shrink-0">
        <button
          id="color-picker-btn"
          onClick={() => setShowColorPicker(v => !v)}
          title="Change icon color"
          className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[var(--border-medium)]
                     bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] transition-colors"
        >
          {/* Color swatch */}
          <span className="w-4 h-4 rounded-full border border-white/20 shrink-0" style={{ background: activeColor }} />
          <span className="hidden sm:block text-xs font-medium text-[var(--text-secondary)]">Color</span>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </button>

        {showColorPicker && (
          <div className="
            absolute top-full right-0 mt-2 z-50
            w-64 p-4 rounded-2xl
            bg-[var(--bg-secondary)] border border-[var(--border-medium)]
            shadow-2xl backdrop-blur-md animate-slide-up
          ">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-3">Icon Color</p>

            {/* Preset swatches */}
            <div className="grid grid-cols-5 gap-2 mb-4">
              {COLOR_PRESETS.map(hex => (
                <button
                  key={hex}
                  onClick={() => { setIconColor(hex); setShowColorPicker(false); }}
                  title={hex}
                  className={`
                    w-9 h-9 rounded-lg border-2 transition-all duration-150
                    hover:scale-110 hover:shadow-lg
                    ${iconColor === hex ? 'border-white scale-110' : 'border-white/10'}
                  `}
                  style={{ background: hex, boxShadow: iconColor === hex ? `0 0 10px ${hex}88` : undefined }}
                />
              ))}
            </div>

            {/* Native color input */}
            <div className="flex items-center gap-3">
              <label className="text-xs text-[var(--text-secondary)] shrink-0">Custom:</label>
              <input
                type="color"
                value={iconColor || '#00B4FF'}
                onChange={e => setIconColor(e.target.value)}
                className="w-10 h-8 rounded-lg cursor-pointer border border-white/10 bg-transparent"
                title="Pick a custom color"
              />
              <span className="font-mono text-xs text-[var(--text-muted)]">{iconColor || '#00B4FF'}</span>
              {iconColor && (
                <button
                  onClick={() => { setIconColor(''); setShowColorPicker(false); }}
                  className="ml-auto text-xs text-[var(--text-muted)] hover:text-[var(--neon-red)] transition-colors"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      )}

      {/* Selection count */}
      {activeAppMode === 'icons' && selectedIds.size > 0 && (
        <button onClick={clearSelection}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                     bg-[var(--neon-blue)]/10 border border-[var(--neon-blue)]/30
                     text-xs font-medium text-[var(--neon-blue)] hover:bg-[var(--neon-blue)]/20
                     transition-colors shrink-0">
          {selectedIds.size} selected ✕
        </button>
      )}

      {/* Theme toggle */}
      <button
        id="theme-toggle-btn"
        onClick={toggleTheme}
        className="btn btn-ghost w-9 h-9 p-0 shrink-0"
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      >
        {theme === 'dark' ? (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="4"/>
            <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
          </svg>
        ) : (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        )}
      </button>
    </header>
  );
}
