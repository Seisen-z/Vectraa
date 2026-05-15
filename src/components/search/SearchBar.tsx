/**
 * SearchBar.tsx — Debounced search using filteredManifest count.
 */
import React, { useCallback, useRef, useState } from 'react';
import { useIconStore } from '@/store/useIconStore';

export default function SearchBar() {
  const { setSearch, filteredManifest, manifest, searchQuery } = useIconStore();
  const [localValue, setLocalValue] = useState(searchQuery);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalValue(val);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setSearch(val), 180);
  }, [setSearch]);

  const handleClear = useCallback(() => { setLocalValue(''); setSearch(''); }, [setSearch]);
  const showCount = localValue.trim().length > 0;

  return (
    <div className="relative flex items-center w-full max-w-xl">
      <div className="absolute left-3 pointer-events-none text-[var(--text-muted)]">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
      </div>
      <input
        id="icon-search-input"
        type="text"
        value={localValue}
        onChange={handleChange}
        placeholder="Search 50,000+ icons…"
        aria-label="Search icons"
        className="w-full pl-9 pr-28 py-2.5 rounded-xl text-sm font-medium bg-[var(--bg-card)] border border-[var(--border-medium)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--neon-blue)] focus:ring-1 focus:ring-[var(--neon-blue)]/30 transition-all duration-200"
      />
      {showCount && (
        <span className="absolute right-10 text-[11px] font-medium text-[var(--text-muted)] whitespace-nowrap">
          {filteredManifest.length.toLocaleString()} result{filteredManifest.length !== 1 ? 's' : ''}
        </span>
      )}
      {localValue && (
        <button onClick={handleClear} className="absolute right-3 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors" aria-label="Clear search">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      )}
      {!showCount && (
        <span className="absolute right-3 text-[11px] text-[var(--text-muted)]">
          {manifest.length.toLocaleString()} icons
        </span>
      )}
    </div>
  );
}
