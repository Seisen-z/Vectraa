/**
 * App.tsx — Root component. Loads manifest on mount, applies persisted theme.
 */
import React, { useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useIconStore } from '@/store/useIconStore';
import { useThemeStore, applyTheme } from '@/store/useThemeStore';

export default function App() {
  const { loadManifest } = useIconStore();
  const { theme } = useThemeStore();

  useEffect(() => { applyTheme(theme); }, [theme]);
  useEffect(() => { loadManifest(); }, [loadManifest]);

  return <AppLayout />;
}
