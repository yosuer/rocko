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
      className="w-full min-w-0 flex items-center gap-2 sm:gap-3 p-2 rounded-lg text-left transition-all group"
      style={{
        background: 'oklch(0.18 0.025 42 / 0.4)',
        border: '1px solid oklch(0.25 0.025 42)',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = 'oklch(0.22 0.028 44 / 0.8)';
        (e.currentTarget as HTMLButtonElement).style.borderColor = 'oklch(0.71 0.145 85 / 0.35)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = 'oklch(0.18 0.025 42 / 0.4)';
        (e.currentTarget as HTMLButtonElement).style.borderColor = 'oklch(0.25 0.025 42)';
      }}
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
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: 'oklch(0.20 0.025 42)' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="oklch(0.50 0.04 60)" strokeWidth="1.5">
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
          </div>
        )}
      </div>

      {/* Botón agregar: junto a la miniatura para que nunca se recorte */}
      <div
        className="shrink-0 rounded-full flex items-center justify-center transition-transform group-hover:scale-110"
        style={{
          width: 28,
          height: 28,
          background: 'oklch(0.71 0.145 85)',
          color: 'oklch(0.12 0.022 42)',
        }}
        aria-hidden
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </div>

      {/* Título, artista, duración y género en la zona flexible (puede truncar) */}
      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-medium truncate leading-tight"
          style={{ color: 'oklch(0.90 0.025 80)' }}
        >
          {song.title}
        </p>
        <p className="text-xs truncate mt-0.5" style={{ color: 'oklch(0.71 0.145 85)' }}>
          {song.artist}
        </p>
        <p className="text-xs truncate mt-0.5 flex items-center gap-1.5" style={{ color: 'oklch(0.50 0.025 60)' }}>
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
