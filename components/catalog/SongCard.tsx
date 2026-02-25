'use client';

import Image from 'next/image';
import { formatDuration } from '@/lib/utils/youtube';
import type { Song } from '@/lib/types';

interface SongCardProps {
  song: Song;
  onSelect: (song: Song) => void;
}

export function SongCard({ song, onSelect }: SongCardProps) {
  return (
    <button
      onClick={() => onSelect(song)}
      className="w-full min-w-0 flex items-center gap-2 sm:gap-3 p-2 rounded-lg text-left transition-all group bg-card/40 border border-border hover:bg-card hover:border-primary/35"
    >
      {/* Thumbnail */}
      <div className="shrink-0 rounded overflow-hidden" style={{ width: 44, height: 44 }}>
        {song.thumbnail ? (
          <Image
            src={song.thumbnail}
            alt={song.title}
            width={44}
            height={44}
            className="object-cover w-full h-full"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground">
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
          </div>
        )}
      </div>

      {/* Botón agregar: junto a la miniatura para que nunca se recorte */}
      <div
        className="shrink-0 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 bg-primary text-primary-foreground w-7 h-7"
        aria-hidden
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </div>

      {/* Título, artista, duración y género en la zona flexible (puede truncar) */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate leading-tight text-foreground">
          {song.title}
        </p>
        <p className="text-xs truncate mt-0.5 text-primary">{song.artist}</p>
        <p className="text-xs truncate mt-0.5 flex items-center gap-1.5 text-muted-foreground">
          <span className="font-mono shrink-0">{formatDuration(song.duration ?? null)}</span>
          {song.genre && (
            <>
              <span className="shrink-0">·</span>
              <span className="truncate">{song.genre}</span>
            </>
          )}
        </p>
      </div>
    </button>
  );
}
