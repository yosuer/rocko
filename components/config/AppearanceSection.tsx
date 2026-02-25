'use client';

import { useThemeStore } from '@/lib/store/themeStore';
import { THEMES, type ThemeId } from '@/lib/theme';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const themePreviewColors: Record<ThemeId, { bg: string; primary: string; accent: string }> = {
  classic: {
    bg: 'oklch(0.10 0.022 40)',
    primary: 'oklch(0.71 0.145 85)',
    accent: 'oklch(0.48 0.175 25)',
  },
  neon: {
    bg: 'oklch(0.08 0.01 270)',
    primary: 'oklch(0.75 0.15 195)',
    accent: 'oklch(0.65 0.22 330)',
  },
  minimal: {
    bg: 'oklch(0.14 0.01 260)',
    primary: 'oklch(0.55 0.18 250)',
    accent: 'oklch(0.55 0.18 250)',
  },
  vinyl: {
    bg: 'oklch(0.18 0.03 55)',
    primary: 'oklch(0.72 0.12 75)',
    accent: 'oklch(0.55 0.12 40)',
  },
};

export function AppearanceSection() {
  const { theme, setTheme } = useThemeStore();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Apariencia</CardTitle>
        <CardDescription>
          Look and feel de la rockola. Elige el tema que más te guste.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {THEMES.map((t) => {
            const colors = themePreviewColors[t.id];
            const isSelected = theme === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTheme(t.id)}
                className={cn(
                  'rounded-xl border-2 p-4 text-left transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background',
                  isSelected
                    ? 'border-primary ring-2 ring-primary/30'
                    : 'border-border hover:border-primary/50'
                )}
                title={t.description}
              >
                <div
                  className="flex gap-2 mb-3 rounded-lg overflow-hidden h-12"
                  style={{ background: colors.bg }}
                >
                  <div
                    className="w-1/3 shrink-0"
                    style={{ background: colors.primary }}
                  />
                  <div
                    className="w-1/4 shrink-0"
                    style={{ background: colors.accent }}
                  />
                </div>
                <p className="font-semibold text-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{t.description}</p>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
