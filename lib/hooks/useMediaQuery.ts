'use client';

import { useEffect, useState } from 'react';

/**
 * Returns whether the viewport matches the given media query.
 * Defaults to false during SSR and on first mount to avoid hydration mismatch,
 * then updates to the real value.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    const id = requestAnimationFrame(() => setMatches(media.matches));
    media.addEventListener('change', handler);
    return () => {
      cancelAnimationFrame(id);
      media.removeEventListener('change', handler);
    };
  }, [query]);

  return matches;
}

/** Tailwind lg breakpoint (1024px) — desktop layout. */
export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 1024px)');
}
