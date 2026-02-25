'use client';

import { useJukeboxStore } from '@/lib/store/jukeboxStore';
import { Slider } from '@/components/ui/slider';

interface PlayerControlsProps {
  onTogglePlay: () => void;
  onSkip: () => void;
  onVolumeChange: (vol: number) => void;
  isAdmin?: boolean;
}

export function PlayerControls({
  onTogglePlay,
  onSkip,
  onVolumeChange,
  isAdmin = false,
}: PlayerControlsProps) {
  const { isPlaying, volume, setVolume, currentSong } = useJukeboxStore();

  function handleVolume(values: number[]) {
    const v = values[0];
    setVolume(v);
    onVolumeChange(v);
  }

  const iconFill = 'var(--primary-foreground)';

  return (
    <div className="metal-panel rounded-xl px-5 py-3 flex items-center gap-4 border border-border shadow-lg">
      {/* Botón Play/Pause */}
      <button
        onClick={onTogglePlay}
        disabled={!currentSong}
        className="chrome-button rounded-full flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ width: 48, height: 48 }}
        title={isPlaying ? 'Pausar' : 'Reproducir'}
      >
        {isPlaying ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill={iconFill}>
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill={iconFill}>
            <polygon points="5,3 19,12 5,21" />
          </svg>
        )}
      </button>

      {/* Botón Skip (siempre visible para admin, deshabilitado para usuarios) */}
      <button
        onClick={onSkip}
        disabled={!currentSong || !isAdmin}
        className="chrome-button rounded-full flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ width: 40, height: 40 }}
        title={isAdmin ? 'Saltar canción (admin)' : 'Vota para saltar en la cola →'}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill={iconFill}>
          <polygon points="5,4 13,12 5,20" />
          <line x1="19" y1="4" x2="19" y2="20" stroke={iconFill} strokeWidth="2" />
        </svg>
      </button>

      {/* Separador */}
      <div className="h-8 w-px bg-border" />

      {/* Control de volumen */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <button
          onClick={() => handleVolume([volume === 0 ? 70 : 0])}
          className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
          title="Silenciar/Activar"
        >
          {volume === 0 ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="1" y1="1" x2="23" y2="23" />
              <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
              <path d="M17 16.95A7 7 0 0 0 5.05 7M12 19V9" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
          )}
        </button>

        <Slider
          value={[volume]}
          min={0}
          max={100}
          step={1}
          onValueChange={handleVolume}
          className="flex-1"
        />

        <span className="text-xs font-mono shrink-0 tabular-nums text-primary" style={{ minWidth: 28, textAlign: 'right' }}>
          {volume}%
        </span>
      </div>
    </div>
  );
}
