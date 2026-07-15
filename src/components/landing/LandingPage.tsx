/**
 * LandingPage.tsx — Marketing entry point. Split hero showcases real icon-card
 * styling instead of generic decoration; stats bar + bento feature grid instead
 * of a uniform 3-column layout.
 */
import React from 'react';
import { useThemeStore } from '@/store/useThemeStore';
import { useAppStore } from '@/store/useAppStore';

const NAV_LINKS: { label: string; mode: 'icons' | 'conversion' | 'api-docs' | 'packages' }[] = [
  { label: 'Icons',    mode: 'icons' },
  { label: 'Convert',  mode: 'conversion' },
  { label: 'API',      mode: 'api-docs' },
  { label: 'Packages', mode: 'packages' },
];

const STATS = [
  { value: '12,000+', label: 'Icons' },
  { value: '4',        label: 'Export formats' },
  { value: '0',        label: 'Auth required' },
  { value: 'MIT',      label: 'License' },
];

/** A handful of simple icon shapes to fill the hero showcase — colored via the
 *  same neon palette the icon grid itself uses. */
const SHOWCASE_ICONS: { path: string; color: string }[] = [
  { path: 'M12 2l2.6 6.6L22 9l-5.5 4.6L18 21l-6-3.7L6 21l1.5-7.4L2 9l7.4-.4z', color: '#FF6B00' }, // star
  { path: 'M12 21s-7.5-4.6-9.5-9.1C1.2 8.6 3 5 6.5 5c2 0 3.5 1.2 5.5 3.3C14 6.2 15.5 5 17.5 5 21 5 22.8 8.6 21.5 11.9 19.5 16.4 12 21 12 21z', color: '#FF2D78' }, // heart
  { path: 'M13 2L3 14h6l-1 8 11-14h-7l1-6z', color: '#FFE600' }, // bolt
  { path: 'M18 10h-.6C16.7 7.1 14.1 5 11 5 7.7 5 5 7.7 5 11c0 .2 0 .4 0 .6C2.7 12 1 14 1 16.5 1 19 3 21 5.5 21H18c2.8 0 5-2.2 5-5s-2.2-5-5-5z', color: '#00B4FF' }, // cloud
  { path: 'M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.1-1.6-5.6-4.5-6.3V4c0-.8-.7-1.5-1.5-1.5S10.5 3.2 10.5 4v.7C7.6 5.4 6 7.9 6 11v5l-2 2v1h16v-1z', color: '#7B2FFF' }, // bell
  { path: 'M19.1 12.9c0-.3.1-.6.1-.9s0-.6-.1-.9l1.9-1.5c.2-.1.2-.4.1-.6l-1.8-3.1c-.1-.2-.4-.3-.6-.2l-2.2.9c-.5-.4-1-.7-1.6-.9l-.3-2.4c0-.2-.2-.4-.5-.4h-3.6c-.3 0-.5.2-.5.4l-.3 2.4c-.6.2-1.1.5-1.6.9l-2.2-.9c-.2-.1-.5 0-.6.2L4.1 8.9c-.1.2-.1.5.1.6l1.9 1.5c0 .3-.1.6-.1.9s0 .6.1.9L4.2 14.4c-.2.1-.2.4-.1.6l1.8 3.1c.1.2.4.3.6.2l2.2-.9c.5.4 1 .7 1.6.9l.3 2.4c0 .2.2.4.5.4h3.6c.3 0 .5-.2.5-.4l.3-2.4c.6-.2 1.1-.5 1.6-.9l2.2.9c.2.1.5 0 .6-.2l1.8-3.1c.1-.2.1-.5-.1-.6zM12 15.6c-2 0-3.6-1.6-3.6-3.6s1.6-3.6 3.6-3.6 3.6 1.6 3.6 3.6-1.6 3.6-3.6 3.6z', color: '#00FF87' }, // gear
  { path: 'M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5z', color: '#00FFFF' }, // mail
  { path: 'M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z', color: '#AAFF00' }, // moon
  { path: 'M12 17c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5zm0-18a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V0a1 1 0 0 1 1-1zm0 19a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1zM4.9 4.9a1 1 0 0 1 1.4 0l.7.7a1 1 0 0 1-1.4 1.4l-.7-.7a1 1 0 0 1 0-1.4z', color: '#FF2525' }, // sun
];

const FEATURES = [
  {
    title: 'REST API',
    desc: 'Fetch any icon as SVG, PNG, JPG, or WebP over plain HTTP — no auth, no SDK, works from any language.',
    span: 'lg:col-span-2',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 17V7a2 2 0 0 1 2-2h8l6 6v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><path d="M14 5v6h6"/>
      </svg>
    ),
    extra: (
      <pre className="mt-4 rounded-lg bg-black/40 border border-white/8 p-3 text-[11px] font-mono text-[var(--text-secondary)] overflow-x-auto">
{`GET /api/icons/rocket/svg?color=cyan`}
      </pre>
    ),
  },
  {
    title: 'Format Conversion',
    desc: 'Convert between SVG, PNG, ICO, PDF, and dozens of other formats right in the browser.',
    span: '',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12a9 9 0 1 1-3.51-7.14M21 3v6h-6"/>
      </svg>
    ),
  },
  {
    title: 'Fully Customizable',
    desc: 'Recolor, resize, and toggle borders on any icon before you export it — no design tool required.',
    span: '',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/>
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
      </svg>
    ),
  },
  {
    title: 'Bulk Download',
    desc: 'Select as many icons as you need and export them all as a single ZIP.',
    span: '',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 15V3M7 10l5 5 5-5M19 21H5"/>
      </svg>
    ),
  },
  {
    title: 'Free & Open Source',
    desc: 'No accounts, no rate limits, no pricing tiers. Browse the source on GitHub any time.',
    span: 'lg:col-span-2',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a10 10 0 0 0-3.16 19.5c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.36 1.09 2.94.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.53 9.53 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2z"/>
      </svg>
    ),
  },
];

export default function LandingPage() {
  const { theme, toggleTheme } = useThemeStore();
  const { setAppMode } = useAppStore();

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-theme">
      {/* ── Nav ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 flex items-center gap-4 px-5 sm:px-8 h-14 bg-[var(--bg-header)] backdrop-blur-md border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-md bg-[var(--accent-soft)] border border-[var(--accent-border)] flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
              <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
            </svg>
          </div>
          <span className="text-sm font-bold tracking-tight">
            Vec<span style={{ color: 'var(--accent)' }}>tra</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-1 ml-2">
          {NAV_LINKS.map(link => (
            <button
              key={link.mode}
              onClick={() => setAppMode(link.mode)}
              className="px-3 py-1.5 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5 transition-colors"
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="flex-1" />

        <button
          onClick={toggleTheme}
          className="btn btn-ghost w-8 h-8 p-0 shrink-0"
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
            </svg>
          ) : (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          )}
        </button>
        <a
          href="https://github.com/Seisen88/Iconversion"
          target="_blank" rel="noopener noreferrer"
          className="btn btn-ghost w-8 h-8 p-0 shrink-0"
          aria-label="GitHub repository"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2a10 10 0 0 0-3.16 19.5c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.36 1.09 2.94.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.53 9.53 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2z"/>
          </svg>
        </a>
      </header>

      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 sm:px-8 pt-16 pb-20 grid lg:grid-cols-2 gap-14 items-center">
        {/* Copy */}
        <div>
          <p className="text-xs font-bold tracking-widest uppercase text-[var(--accent)] mb-4">Icon library &amp; API</p>
          <h1 className="text-4xl sm:text-[3.25rem] font-extrabold tracking-tight leading-[1.05] mb-5">
            Icons that ship<br />
            <span style={{ color: 'var(--accent)' }}>with your product.</span>
          </h1>
          <p className="text-[var(--text-secondary)] text-base sm:text-lg mb-8 leading-relaxed max-w-md">
            12,000+ consistent icons, a REST API, and built-in format conversion —
            everything you need to stop hand-rolling icon assets.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button onClick={() => setAppMode('icons')} className="btn btn-primary btn-pill">
              Browse Icons
            </button>
            <button onClick={() => setAppMode('api-docs')} className="btn btn-secondary btn-pill">
              Read the Docs
            </button>
          </div>
        </div>

        {/* Icon showcase — mirrors the real icon-card styling from the app grid */}
        <div className="hidden sm:grid grid-cols-3 gap-3 max-w-sm mx-auto lg:mx-0 lg:ml-auto">
          {SHOWCASE_ICONS.map((ic, i) => (
            <div
              key={i}
              className="aspect-square rounded-2xl flex items-center justify-center transition-transform hover:scale-105"
              style={{
                background: `${ic.color}0F`,
                border: `1.5px solid ${ic.color}40`,
                transform: i % 2 === 0 ? 'translateY(-6px)' : 'translateY(6px)',
              }}
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill={ic.color} aria-hidden="true">
                <path d={ic.path} />
              </svg>
            </div>
          ))}
        </div>
      </section>

      {/* ── Stats bar ───────────────────────────────────────── */}
      <section className="border-y border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 py-8 grid grid-cols-2 sm:grid-cols-4 gap-6">
          {STATS.map(s => (
            <div key={s.label}>
              <p className="text-2xl font-extrabold text-[var(--text-primary)]">{s.value}</p>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Feature grid (bento) ────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 sm:px-8 py-20">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-8">Everything, built in.</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {FEATURES.map(f => (
            <div
              key={f.title}
              className={`p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--border-medium)] transition-colors ${f.span}`}
            >
              <div className="w-9 h-9 rounded-lg bg-[var(--accent-soft)] text-[var(--accent)] flex items-center justify-center mb-4">
                {f.icon}
              </div>
              <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1.5">{f.title}</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{f.desc}</p>
              {f.extra}
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="border-t border-[var(--border-subtle)]">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--text-muted)]">
          <span>© {new Date().getFullYear()} Vectra. Free and open source.</span>
          <div className="flex items-center gap-4">
            <button onClick={() => setAppMode('packages')} className="hover:text-[var(--text-secondary)] transition-colors">Packages</button>
            <button onClick={() => setAppMode('api-docs')} className="hover:text-[var(--text-secondary)] transition-colors">API</button>
            <a href="https://github.com/Seisen88/Iconversion" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--text-secondary)] transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
