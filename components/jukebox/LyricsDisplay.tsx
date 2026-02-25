'use client';

import { useEffect, useRef } from 'react';
import { useJukeboxStore } from '@/lib/store/jukeboxStore';
import { parseLrc } from '@/lib/utils/lrc';
import { cn } from '@/lib/utils';

interface LyricsDisplayProps {
  lyrics: string | null | undefined;
  /**
   * Desplazamiento en segundos.
   * Si la letra se adelanta (el LRC tiene intro que tu vídeo no tiene): pon ej. 38 para restar 38s a cada tiempo del LRC.
   * Si la letra va retrasada: usa valor negativo (ej. -5).
   */
  lyricsOffset?: number;
  /** Identificador de la canción actual; al cambiar, el scroll vuelve al inicio. */
  songId?: string | null;
}

/** Calcula el scrollTop para centrar la línea en el contenedor (usando posiciones reales en pantalla). */
function getScrollToCenterLine(container: HTMLDivElement, lineEl: HTMLElement): number {
  const cr = container.getBoundingClientRect();
  const lr = lineEl.getBoundingClientRect();
  const lineTopInContent = lr.top - cr.top + container.scrollTop;
  return lineTopInContent - container.clientHeight / 2 + lr.height / 2;
}

export function LyricsDisplay({ lyrics, lyricsOffset = 0, songId }: LyricsDisplayProps) {
  const currentTime = useJukeboxStore((s) => s.currentTime);
  const lines = parseLrc(lyrics);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLDivElement>(null);

  // Al cambiar de canción, volver el scroll al inicio
  useEffect(() => {
    if (containerRef.current) containerRef.current.scrollTop = 0;
  }, [songId]);

  // Restamos offset a los tiempos del LRC
  const effectiveTime = (lineTime: number) => lineTime - lyricsOffset;

  // Índice de la línea actual (la última cuyo tiempo efectivo <= currentTime)
  const activeIndex = (() => {
    if (lines.length === 0) return -1;
    let i = 0;
    while (i < lines.length && effectiveTime(lines[i].time) <= currentTime) i++;
    return i - 1;
  })();

  // Scroll suave: interpolamos la posición entre la línea actual y la siguiente según currentTime
  useEffect(() => {
    const container = containerRef.current;
    const active = activeRef.current;
    if (activeIndex < 0 || !container || !active) return;

    const timeCurrent = lines[activeIndex].time - lyricsOffset;
    const hasNext = activeIndex + 1 < lines.length;
    const timeNext = hasNext ? lines[activeIndex + 1].time - lyricsOffset : timeCurrent;
    const duration = Math.max(timeNext - timeCurrent, 0.001);
    const progress = Math.min(Math.max((currentTime - timeCurrent) / duration, 0), 1);

    const applyScroll = () => {
      if (!containerRef.current || !activeRef.current) return;
      const c = containerRef.current;
      const a = activeRef.current;
      const n = nextRef.current;
      const scrollActive = getScrollToCenterLine(c, a);
      const scrollNext = hasNext && n ? getScrollToCenterLine(c, n) : scrollActive;
      const targetScroll = scrollActive * (1 - progress) + scrollNext * progress;
      const maxScroll = c.scrollHeight - c.clientHeight;
      c.scrollTop = Math.max(0, Math.min(targetScroll, maxScroll));
    };

    // Ejecutar tras el layout para que los refs y getBoundingClientRect sean correctos
    const raf = requestAnimationFrame(applyScroll);
    return () => cancelAnimationFrame(raf);
  }, [currentTime, activeIndex, lines, lyricsOffset]);

  if (lines.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className="w-full min-h-[8rem] max-h-80 overflow-y-auto py-2 custom-scrollbar rounded-lg bg-background/50 border border-border/50 px-4"
      aria-label="Letra de la canción"
    >
      <div className="flex flex-col items-center justify-center gap-0.5 min-h-full">
        {lines.map((line, i) => (
          <div
            key={i}
            ref={i === activeIndex ? activeRef : i === activeIndex + 1 ? nextRef : undefined}
            className={cn(
              'transition-all duration-200 text-center w-full py-0.5 px-2 rounded',
              i === activeIndex
                ? 'text-primary font-semibold text-lg'
                : 'text-muted-foreground text-sm'
            )}
          >
            {line.text || '\u00A0'}
          </div>
        ))}
      </div>
    </div>
  );
}
