import React from 'react';
import { useThemeStore } from '@/store/useThemeStore';
import { useAppStore } from '@/store/useAppStore';

const TABS = [
  { id: 'icons'      as const, label: 'Icons'    },
  { id: 'conversion' as const, label: 'Convert'  },
  { id: 'api-docs'   as const, label: 'API'      },
  { id: 'packages'   as const, label: 'Packages' },
];

interface Props { onMobileMenuToggle: () => void; }

export default function Header({ onMobileMenuToggle }: Props) {
  const { theme, toggleTheme }        = useThemeStore();
  const { activeAppMode, setAppMode } = useAppStore();

  return (
    <header className="
      sticky top-0 z-30 flex items-center gap-4 px-5 h-12
      bg-[var(--bg-header)] backdrop-blur-md
      border-b border-[var(--border-subtle)]
      shrink-0
    ">
      {/* Mobile burger */}
      <button onClick={onMobileMenuToggle}
        className="md:hidden btn btn-ghost w-8 h-8 p-0 shrink-0" aria-label="Open menu">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M3 6h18M3 12h18M3 18h18"/>
        </svg>
      </button>

      {/* Logo */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="w-6 h-6 rounded-md bg-[var(--neon-blue)]/15 border border-[var(--neon-blue)]/40 flex items-center justify-center">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--neon-blue)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1"/>
            <rect x="14" y="3" width="7" height="7" rx="1"/>
            <rect x="3" y="14" width="7" height="7" rx="1"/>
            <rect x="14" y="14" width="7" height="7" rx="1"/>
          </svg>
        </div>
        <span className="hidden sm:block text-sm font-bold text-[var(--text-primary)] tracking-tight">
          Vec<span style={{ color: 'var(--neon-blue)' }}>tra</span>
        </span>
      </div>

      {/* Nav */}
      <nav className="hidden md:flex items-center gap-0.5 ml-2">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setAppMode(tab.id)}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeAppMode === tab.id
                ? 'text-[var(--text-primary)] bg-white/8'
                : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-white/4'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="flex-1" />

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="btn btn-ghost w-8 h-8 p-0 shrink-0"
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      >
        {theme === 'dark' ? (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="4"/>
            <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
          </svg>
        ) : (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        )}
      </button>
    </header>
  );
}
