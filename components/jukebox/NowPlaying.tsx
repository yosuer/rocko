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
  const { currentSong, isPlaying, queue, playerReady, setPlayerReady } = useJukeboxStore();
  const { onReady, onStateChange, togglePlay, setVolume, loadVideo } = useYouTube();
  const { advanceQueue } = useQueue();

  const hasPending = queue.length > 0;
  const videoId = currentSong?.song?.youtube_id ?? '';

  // Si no hay canción, marcar reproductor como no listo (evita usar ref destruido)
  useEffect(() => {
    if (!videoId) setPlayerReady(false);
  }, [videoId, setPlayerReady]);

  // Cargar nueva canción cuando cambia currentSong y el reproductor ya está listo (evita playVideo sobre null)
  useEffect(() => {
    if (videoId && playerReady) {
      loadVideo(videoId);
    }
  }, [currentSong?.id, videoId, playerReady, loadVideo]);

  const thumbnail = currentSong?.song?.thumbnail ?? null;
  const title = currentSong?.song?.title ?? 'Sin canción';
  const artist = currentSong?.song?.artist ?? 'Selecciona una canción del catálogo';
  const duration = currentSong?.song?.duration ?? null;
  const requester = currentSong?.requester?.username ?? null;

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {/* YouTube player oculto — solo montar con videoId válido para evitar playVideo sobre null en react-youtube */}
      {videoId && (
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
            key={videoId}
            videoId={videoId}
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
      )}

      {/* Disco giratorio */}
      <div className="relative">
        {/* Efecto de plato de tocadiscos */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none border-2 border-primary/20"
          style={{
            margin: -12,
            background: 'radial-gradient(circle, var(--card) 0%, var(--background) 100%)',
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
              className="animate-pulse-gold rounded-full bg-primary inline-block flex-shrink-0"
              style={{ width: 8, height: 8 }}
            />
          )}
          <h2 className="text-xl font-bold leading-tight truncate max-w-xs font-display text-foreground">
            {title}
          </h2>
        </div>

        <p className="text-sm truncate text-primary">{artist}</p>

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
          className="gold-button rounded-xl px-6 py-2.5 font-semibold text-sm border-none text-primary-foreground"
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
