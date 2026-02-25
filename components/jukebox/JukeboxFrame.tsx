'use client';

import { useThemeStore } from '@/lib/store/themeStore';
import { NowPlaying } from './NowPlaying';
import { AdaptiveFrame } from './frames/AdaptiveFrame';

interface JukeboxFrameProps {
  isAdmin?: boolean;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

export function JukeboxFrame({
  isAdmin = false,
  isFullscreen = false,
  onToggleFullscreen,
}: JukeboxFrameProps) {
  const theme = useThemeStore((s) => s.theme);

  return (
    <AdaptiveFrame theme={theme}>
      <NowPlaying
        isAdmin={isAdmin}
        isFullscreen={isFullscreen}
        onToggleFullscreen={onToggleFullscreen}
      />
    </AdaptiveFrame>
  );
}
