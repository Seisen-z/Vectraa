import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import IconGrid from '@/components/icons/IconGrid';
import BulkDownloadBar from '@/components/bulk/BulkDownloadBar';
import SearchBar from '@/components/search/SearchBar';
import { useIconStore } from '@/store/useIconStore';
import { useAppStore } from '@/store/useAppStore';
import ConversionView from '@/components/conversion/ConversionView';
import ApiDocsView from '@/components/docs/ApiDocsView';
import PackagesView from '@/components/packages/PackagesView';
import LandingPage from '@/components/landing/LandingPage';

export default function AppLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { activeAppMode } = useAppStore();
  const { selectedIds, clearSelection } = useIconStore();

  if (activeAppMode === 'landing') return <LandingPage />;

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[var(--bg-primary)] transition-theme">
      <Header onMobileMenuToggle={() => setMobileMenuOpen(o => !o)} />

      <div className="flex flex-1 overflow-hidden">
        {activeAppMode === 'icons' ? (
          <>
            <Sidebar mobileOpen={mobileMenuOpen} onMobileClose={() => setMobileMenuOpen(false)} />
            <main className="flex flex-col flex-1 overflow-hidden">
              {/* Search bar */}
              <div className="flex items-center gap-3 px-4 py-2.5 border-b border-[var(--border-subtle)] shrink-0">
                <SearchBar />
                {selectedIds.size > 0 && (
                  <button
                    onClick={clearSelection}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[var(--accent-soft)] border border-[var(--accent-border)] text-xs font-medium text-[var(--accent)] hover:brightness-110 transition-colors shrink-0 whitespace-nowrap"
                  >
                    {selectedIds.size} selected ✕
                  </button>
                )}
              </div>
              <div className="flex-1 overflow-hidden px-2 pt-2 pb-1">
                <IconGrid />
              </div>
            </main>
          </>
        ) : activeAppMode === 'conversion' ? (
          <ConversionView />
        ) : activeAppMode === 'api-docs' ? (
          <ApiDocsView />
        ) : (
          <PackagesView />
        )}
      </div>

      {activeAppMode === 'icons' && <BulkDownloadBar />}
    </div>
  );
}
