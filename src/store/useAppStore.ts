import { create } from 'zustand';

type AppMode = 'landing' | 'icons' | 'conversion' | 'api-docs' | 'packages';

interface AppState {
  activeAppMode: AppMode;
  setAppMode: (mode: AppMode) => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeAppMode: 'landing',
  setAppMode: (mode) => set({ activeAppMode: mode }),
}));
