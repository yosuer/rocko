'use client';

import { useEffect } from 'react';
import YouTube from 'react-youtube';
import { SpinningDisc } from './SpinningDisc';
import { PlayerControls } from './PlayerControls';
import { useJukeboxStore } from '@/lib/store/jukeboxStore';
import { useYouTube } from '@/lib/hooks/useYouTube';
import { useQueue } from '@/lib/hooks/useQueue';
import { formatDuration } from '@/lib/utils/youtube';

interface NowPlayingProps {
  isAdmin?: boolean;
}

export function NowPlaying({ isAdmin = false }: NowPlayingProps) {
  const { currentSong, isPlaying, volume, queue } = useJukeboxStore();
  const { onReady, onStateChange, togglePlay, setVolume, loadVideo } = useYouTube();
  const { advanceQueue } = useQueue();

  const hasPending = queue.length > 0;

  // Cargar nueva canción cuando cambia currentSong
  useEffect(() => {
    if (currentSong?.song?.youtube_id) {
      loadVideo(currentSong.song.youtube_id);
    }
  }, [currentSong?.id, currentSong?.song?.youtube_id, loadVideo]);

  const thumbnail = currentSong?.song?.thumbnail ?? null;
  const title = currentSong?.song?.title ?? 'Sin canción';
  const artist = currentSong?.song?.artist ?? 'Selecciona una canción del catálogo';
  const duration = currentSong?.song?.duration ?? null;
  const requester = currentSong?.requester?.username ?? null;

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {/* YouTube player oculto — mantiene posición fuera de pantalla */}
      <div
        style={{
          position: 'absolute',
          left: '-9999px',
          width: 1,
          height: 1,
          overflow: 'hidden',
        }}
        aria-hidden="true"
      >
        <YouTube
          videoId={currentSong?.song?.youtube_id ?? ''}
          opts={{
            width: '1',
            height: '1',
            playerVars: {
              autoplay: 1,
              controls: 0,
              disablekb: 1,
              fs: 0,
              iv_load_policy: 3,
              modestbranding: 1,
              rel: 0,
            },
          }}
          onReady={onReady}
          onStateChange={onStateChange}
          onEnd={advanceQueue}
        />
      </div>

      {/* Disco giratorio */}
      <div className="relative">
        {/* Efecto de plato de tocadiscos */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            margin: -12,
            background: 'radial-gradient(circle, oklch(0.20 0.025 42) 0%, oklch(0.14 0.022 40) 100%)',
            border: '2px solid oklch(0.71 0.145 85 / 0.2)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          }}
        />
        <SpinningDisc thumbnail={thumbnail} isPlaying={isPlaying} size={220} />
      </div>

      {/* Info de la canción */}
      <div className="text-center w-full px-4 space-y-1">
        <div className="flex items-center justify-center gap-2">
          {isPlaying && (
            <span
              className="animate-pulse-gold rounded-full"
              style={{
                width: 8,
                height: 8,
                background: 'oklch(0.71 0.145 85)',
                display: 'inline-block',
                flexShrink: 0,
              }}
            />
          )}
          <h2
            className="text-xl font-bold leading-tight truncate max-w-xs"
            style={{ fontFamily: 'var(--font-playfair)', color: 'oklch(0.93 0.030 80)' }}
          >
            {title}
          </h2>
        </div>

        <p
          className="text-sm truncate"
          style={{ color: 'oklch(0.71 0.145 85)' }}
        >
          {artist}
        </p>

        <div className="flex items-center justify-center gap-3 text-xs font-mono text-muted-foreground">
          {duration && <span>{formatDuration(duration)}</span>}
          {requester && (
            <>
              {duration && <span>·</span>}
              <span>por {requester}</span>
            </>
          )}
        </div>
      </div>

      {/* Botón de arranque cuando hay canciones pendientes pero nada reproduciendo */}
      {!currentSong && hasPending && (
        <button
          onClick={advanceQueue}
          className="gold-button rounded-xl px-6 py-2.5 font-semibold text-sm border-none"
          style={{ color: 'oklch(0.12 0.022 42)' }}
        >
          ▶ Iniciar cola
        </button>
      )}

      {/* Controles */}
      <div className="w-full">
        <PlayerControls
          onTogglePlay={togglePlay}
          onSkip={advanceQueue}
          onVolumeChange={setVolume}
          isAdmin={isAdmin}
        />
      </div>
    </div>
  );
}
