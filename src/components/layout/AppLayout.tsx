/**
 * AppLayout.tsx — Uses filteredManifest for counts.
 */
import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import IconGrid from '@/components/icons/IconGrid';
import BulkDownloadBar from '@/components/bulk/BulkDownloadBar';
import { useIconStore } from '@/store/useIconStore';
import { useAppStore } from '@/store/useAppStore';
import { CATEGORIES } from '@/data/categories';
import ConversionView from '@/components/conversion/ConversionView';
import ApiDocsView from '@/components/docs/ApiDocsView';

export default function AppLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { activeAppMode } = useAppStore();
  const { filteredManifest, activeCategory, searchQuery } = useIconStore();

  const categoryLabel = CATEGORIES.find(c => c.id === activeCategory)?.label ?? 'All Icons';
  const categoryEmoji = CATEGORIES.find(c => c.id === activeCategory)?.emoji ?? '✦';

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[var(--bg-primary)] transition-theme">
      <Header onMobileMenuToggle={() => setMobileMenuOpen(o => !o)} />
      <div className="flex flex-1 overflow-hidden">
        {activeAppMode === 'icons' ? (
          <>
            <Sidebar mobileOpen={mobileMenuOpen} onMobileClose={() => setMobileMenuOpen(false)} />
            <main className="flex flex-col flex-1 overflow-hidden">
              {/* Breadcrumb */}
              <div className="flex items-center justify-between px-5 py-2.5 border-b border-[var(--border-subtle)] shrink-0">
                <div className="flex items-center gap-2 text-sm">
                  {/* Emoji removed */}
                  <span className="font-semibold text-[var(--text-primary)]">{categoryLabel}</span>

                  {searchQuery && (
                    <><span className="text-[var(--text-muted)]">·</span><span className="text-[var(--text-secondary)]">"{searchQuery}"</span></>
                  )}
                </div>
                <span className="text-xs text-[var(--text-muted)] font-medium tabular-nums">
                  {filteredManifest.length.toLocaleString()} icons
                </span>
              </div>
              <div className="flex-1 overflow-hidden px-3 pt-3 pb-2">
                <IconGrid />
              </div>
            </main>
          </>
        ) : activeAppMode === 'conversion' ? (
          <ConversionView />
        ) : (
          <ApiDocsView />
        )}
      </div>
      {activeAppMode === 'icons' && <BulkDownloadBar />}

    </div>
  );
}
