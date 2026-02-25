export const THEME_STORAGE_KEY = 'rocko-theme';

export type ThemeId = 'classic' | 'neon' | 'minimal' | 'vinyl';

export const THEMES: { id: ThemeId; name: string; description: string }[] = [
  { id: 'classic', name: 'Clásico', description: 'Rockola vintage: madera, dorado y rubí' },
  { id: 'neon', name: 'Neón', description: 'Estilo arcade años 80: neones cyan y magenta' },
  { id: 'minimal', name: 'Minimal', description: 'Diseño moderno y limpio, un solo acento' },
  { id: 'vinyl', name: 'Vinilo', description: 'Tonos cálidos, sala de discos' },
];

export function getStoredTheme(): ThemeId {
  if (typeof window === 'undefined') return 'classic';
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === 'neon' || stored === 'minimal' || stored === 'vinyl' || stored === 'classic') return stored;
  return 'classic';
}

export function setStoredTheme(theme: ThemeId): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(THEME_STORAGE_KEY, theme);
  document.documentElement.setAttribute('data-theme', theme);
}
