import { create } from 'zustand';

type AppMode = 'icons' | 'conversion' | 'api-docs';

interface AppState {
  activeAppMode: AppMode;
  setAppMode: (mode: AppMode) => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeAppMode: 'icons',
  setAppMode: (mode) => set({ activeAppMode: mode }),
}));
