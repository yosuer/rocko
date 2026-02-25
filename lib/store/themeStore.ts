'use client';

import { create } from 'zustand';
import { setStoredTheme, getStoredTheme, type ThemeId } from '@/lib/theme';

interface ThemeState {
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;
  hydrate: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: 'classic',
  setTheme: (theme) => {
    setStoredTheme(theme);
    set({ theme });
  },
  hydrate: () => {
    const theme = getStoredTheme();
    if (typeof document !== 'undefined') document.documentElement.setAttribute('data-theme', theme);
    set({ theme });
  },
}));
