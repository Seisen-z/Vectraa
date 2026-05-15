import React, { useState } from 'react';
import Dropzone from './Dropzone';
import { CONVERSION_CATEGORIES, ConversionCategory, ConversionRoute } from '@/data/conversions';

export default function ConversionView() {
  const [activeCategoryId, setActiveCategoryId] = useState<string>(CONVERSION_CATEGORIES[0].id);
  const [activeRoute, setActiveRoute] = useState<ConversionRoute>(CONVERSION_CATEGORIES[0].routes[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const activeCategory = CONVERSION_CATEGORIES.find(c => c.id === activeCategoryId) || CONVERSION_CATEGORIES[0];

  const handleDownload = (blob: Blob, originalName: string, format: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    // Strip original extension and add new one
    const baseName = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
    a.download = `${baseName}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredRoutes = activeCategory.routes.filter(r => 
    r.from.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.to.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-full w-full overflow-hidden">
      
      {/* ── Left Sidebar (Categories) ───────────────────────── */}
      <aside className="flex flex-col h-full bg-[var(--bg-sidebar)] border-r border-[var(--border-subtle)] w-52 shrink-0 overflow-hidden hidden md:flex">
        <div className="px-4 pt-5 pb-3 border-b border-[var(--border-subtle)]">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Conversion Types</p>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar py-2 px-2">
          {CONVERSION_CATEGORIES.map(cat => {
            const isActive = activeCategoryId === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategoryId(cat.id);
                  setActiveRoute(cat.routes[0]);
                  setSearchQuery('');
                }}
                className={`
                  w-full text-left px-3 py-2.5 rounded-xl mb-0.5
                  flex items-center justify-between gap-2
                  transition-all duration-150
                  ${isActive
                    ? 'bg-[var(--neon-purple)]/12 text-[var(--neon-purple)]'
                    : 'text-[var(--text-secondary)] hover:bg-white/5 hover:text-[var(--text-primary)]'}
                `}
              >
                <span className="flex items-center gap-2 min-w-0">
                  <span className="text-xs font-medium truncate">{cat.title}</span>
                </span>
                <span className={`text-[10px] font-medium shrink-0 tabular-nums ${
                  isActive ? 'text-[var(--neon-purple)]' : 'text-[var(--text-muted)]'
                }`}>
                  {cat.routes.length}
                </span>
              </button>
            )
          })}
        </div>
      </aside>

      {/* ── Main Area (Dropzone & Grid) ──────────────────────── */}
      <div className="flex-1 flex flex-col overflow-y-auto bg-[var(--bg-primary)] p-6 sm:p-10 relative">
        <div className="max-w-5xl mx-auto w-full space-y-8 pb-20">
          
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-[var(--text-primary)] tracking-tight flex items-center gap-3">
              <span className="text-4xl">{activeCategory.icon}</span> {activeCategory.title}
            </h1>
            <p className="text-[var(--text-secondary)]">{activeCategory.description}</p>
          </div>

          {/* Active Dropzone */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-3xl p-2 sm:p-6 shadow-2xl relative overflow-hidden group">
            {/* Ambient glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--neon-purple)]/5 to-transparent pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6 px-2">
                <h2 className="text-lg font-bold text-[var(--text-primary)]">Active Converter</h2>
                <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--neon-purple)]/10 border border-[var(--neon-purple)]/30 text-[var(--neon-purple)] font-bold text-sm">
                  {activeRoute.from} <span className="opacity-50">→</span> {activeRoute.to}
                </div>
              </div>
              <Dropzone 
                onFileConverted={handleDownload} 
                sourceFormat={activeRoute.from} 
                targetFormat={activeRoute.to.toLowerCase()} 
              />
            </div>
          </div>

          {/* Search Routes */}
          <div className="flex items-center gap-3 mt-12 mb-6">
            <div className="relative flex-1 max-w-sm">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <input 
                type="text" 
                placeholder="Find a specific conversion..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl py-2 pl-10 pr-4 text-sm outline-none focus:border-[var(--neon-purple)]/50 transition-colors placeholder:text-[var(--text-muted)] text-[var(--text-primary)]"
              />
            </div>
            <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest ml-auto">
              {filteredRoutes.length} options
            </span>
          </div>

          {/* Grid of Options */}
          {filteredRoutes.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {filteredRoutes.map(route => {
                const isSelected = activeRoute.from === route.from && activeRoute.to === route.to;
                return (
                  <button
                    key={`${route.from}-${route.to}`}
                    onClick={() => {
                      setActiveRoute(route);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`
                      flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 group
                      ${isSelected 
                        ? 'border-[var(--neon-purple)] bg-[var(--neon-purple)]/10 shadow-[0_0_15px_rgba(190,0,255,0.15)]' 
                        : 'border-[var(--border-subtle)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] hover:-translate-y-1 hover:border-[var(--neon-purple)]/40 hover:shadow-lg'}
                    `}
                  >
                    <span className={`font-bold transition-colors ${isSelected ? 'text-[var(--neon-purple)]' : 'text-[var(--text-secondary)] group-hover:text-white'}`}>
                      {route.from}
                    </span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" 
                      className={`transition-all ${isSelected ? 'text-[var(--neon-purple)]' : 'text-[var(--text-muted)] group-hover:text-white group-hover:translate-x-1'}`}>
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                    <span className={`font-bold transition-colors ${isSelected ? 'text-[var(--neon-purple)]' : 'text-[var(--text-primary)]'}`}>
                      {route.to}
                    </span>
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-[var(--border-subtle)]">
              <p className="text-[var(--text-muted)] font-medium">No conversions found matching "{searchQuery}".</p>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
