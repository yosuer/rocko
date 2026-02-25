'use client';

import { useThemeStore } from '@/lib/store/themeStore';
import { NowPlaying } from './NowPlaying';
import { AdaptiveFrame } from './frames/AdaptiveFrame';

interface JukeboxFrameProps {
  isAdmin?: boolean;
}

export function JukeboxFrame({ isAdmin = false }: JukeboxFrameProps) {
  const theme = useThemeStore((s) => s.theme);

  return (
    <AdaptiveFrame theme={theme}>
      <NowPlaying isAdmin={isAdmin} />
    </AdaptiveFrame>
  );
}
