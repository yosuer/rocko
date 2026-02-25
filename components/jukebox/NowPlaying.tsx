'use client';

import { useEffect } from 'react';
import YouTube from 'react-youtube';
import { SpinningDisc } from './SpinningDisc';
import { PlayerControls } from './PlayerControls';
import { LyricsDisplay } from './LyricsDisplay';
import { useJukeboxStore } from '@/lib/store/jukeboxStore';
import { useYouTube } from '@/lib/hooks/useYouTube';
import { useQueue } from '@/lib/hooks/useQueue';
import { formatDuration } from '@/lib/utils/youtube';

interface NowPlayingProps {
  isAdmin?: boolean;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

const LYRIC_POLL_INTERVAL_MS = 150;

export function NowPlaying({
  isAdmin = false,
  isFullscreen = false,
  onToggleFullscreen,
}: NowPlayingProps) {
  const { currentSong, isPlaying, playerReady, setPlayerReady, setCurrentTime, currentTime } =
    useJukeboxStore();
  const { onReady, onStateChange, togglePlay, setVolume, loadVideo, getCurrentTime } = useYouTube();
  const { queue, advanceQueue } = useQueue();

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

  // Actualizar currentTime para sincronizar letras (solo cuando está reproduciendo)
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentTime(getCurrentTime());
    }, LYRIC_POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [isPlaying, setCurrentTime, getCurrentTime]);

  const thumbnail = currentSong?.song?.thumbnail ?? null;
  const title = currentSong?.song?.title ?? 'Sin canción';
  const artist = currentSong?.song?.artist ?? 'Selecciona una canción del catálogo';
  const duration = currentSong?.song?.duration ?? null;
  const requester = currentSong?.requester?.username ?? null;

  const hasDuration = typeof duration === 'number' && duration > 0;
  const clampedCurrent = Math.max(0, hasDuration ? Math.min(currentTime, duration!) : currentTime);
  const progressPct = hasDuration && duration ? (clampedCurrent / duration) * 100 : 0;

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {onToggleFullscreen && (
        <div className="w-full flex justify-end px-2">
          <button
            type="button"
            onClick={onToggleFullscreen}
            className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-background/80 px-3 py-1 text-xs font-mono text-muted-foreground hover:bg-background hover:text-foreground transition-colors"
          >
            {isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
          </button>
        </div>
      )}
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
        <SpinningDisc thumbnail={thumbnail} isPlaying={isPlaying} size={280} />
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
          {hasDuration && <span>{formatDuration(duration!)}</span>}
          {requester && (
            <>
              {hasDuration && <span>·</span>}
              <span>por {requester}</span>
            </>
          )}
        </div>
      </div>

      {/* Progreso de la canción */}
      <div className="w-full px-6">
        <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground mb-1">
          <span>{formatDuration(Math.floor(clampedCurrent))}</span>
          {hasDuration && <span>{formatDuration(duration!)}</span>}
        </div>
        {hasDuration && (
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        )}
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

      {/* Letra sincronizada */}
      <div className="w-full">
        <LyricsDisplay
          lyrics={currentSong?.song?.lyrics ?? null}
          lyricsOffset={currentSong?.song?.lyrics_offset ?? 0}
          songId={currentSong?.id ?? null}
        />
      </div>
    </div>
  );
}
