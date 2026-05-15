/**
 * Sidebar.tsx — v5: category filter only (no style selector).
 */
import React from 'react';
import { CATEGORIES } from '@/data/categories';
import { useIconStore } from '@/store/useIconStore';

interface Props { mobileOpen: boolean; onMobileClose: () => void; }

export default function Sidebar({ mobileOpen, onMobileClose }: Props) {
  const { activeCategory, setCategory, manifest } = useIconStore();

  const countMap: Record<string, number> = { all: manifest.length };
  for (const icon of manifest) countMap[icon.c] = (countMap[icon.c] ?? 0) + 1;

  const content = (
    <aside className="flex flex-col h-full bg-[var(--bg-sidebar)] border-r border-[var(--border-subtle)] w-52 shrink-0 overflow-hidden">
      <div className="px-4 pt-5 pb-3 border-b border-[var(--border-subtle)]">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Categories</p>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar py-2 px-2">
        {CATEGORIES.map(cat => {
          const isActive = activeCategory === cat.id;
          const count    = countMap[cat.id] ?? 0;
          return (
            <button
              key={cat.id}
              id={`category-${cat.id}`}
              onClick={() => { setCategory(cat.id); onMobileClose(); }}
              title={cat.description}
              className={`
                w-full text-left px-3 py-2.5 rounded-xl mb-0.5
                flex items-center justify-between gap-2
                transition-all duration-150
                ${isActive
                  ? 'bg-[var(--neon-blue)]/12 text-[var(--neon-blue)]'
                  : 'text-[var(--text-secondary)] hover:bg-white/5 hover:text-[var(--text-primary)]'}
              `}
            >
              <span className="flex items-center gap-2 min-w-0">
                {/* Emoji removed per request */}
                <span className="text-xs font-medium truncate">{cat.label}</span>
              </span>
              {(count > 0 || cat.id === 'all') && (
                <span className={`text-[10px] font-medium shrink-0 tabular-nums ${
                  isActive ? 'text-[var(--neon-blue)]' : 'text-[var(--text-muted)]'
                }`}>
                  {(cat.id === 'all' ? manifest.length : count) >= 1000
                    ? `${((cat.id === 'all' ? manifest.length : count) / 1000).toFixed(1)}k`
                    : (cat.id === 'all' ? manifest.length : count)}
                </span>
              )}
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
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onMobileClose}/>
          <div className="relative flex h-full">{content}</div>
        </div>
      )}
    </>
  );
}
