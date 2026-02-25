'use client';

import { useState, useEffect, useCallback } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { SongCard } from './SongCard';
import { AddToQueue } from './AddToQueue';
import type { Song } from '@/lib/types';

export function SongCatalog() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeGenre, setActiveGenre] = useState('');
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchGenres = useCallback(async () => {
    const res = await fetch('/api/songs/genres');
    if (res.ok) {
      const data = await res.json();
      setGenres(Array.isArray(data) ? data : []);
    }
  }, []);

  const fetchSongs = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('q', search);
    if (activeGenre) params.set('genre', activeGenre);

    const res = await fetch(`/api/songs?${params}`);
    if (res.ok) {
      const data = await res.json();
      setSongs(data);
    }
    setLoading(false);
  }, [search, activeGenre]);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      fetchGenres();
    });
    return () => cancelAnimationFrame(id);
  }, [fetchGenres]);

  useEffect(() => {
    const timer = setTimeout(fetchSongs, 300);
    return () => clearTimeout(timer);
  }, [fetchSongs]);

  function handleSelect(song: Song) {
    setSelectedSong(song);
    setModalOpen(true);
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div
        className="px-4 pt-4 pb-3 shrink-0 space-y-3"
        style={{ borderBottom: '1px solid oklch(0.28 0.025 42)' }}
      >
        <h3
          className="text-sm font-semibold uppercase tracking-wider"
          style={{ fontFamily: 'var(--font-playfair)', color: 'oklch(0.82 0.13 88)' }}
        >
          Catálogo
        </h3>

        {/* Búsqueda */}
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="oklch(0.50 0.025 60)"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar canción o artista..."
            className="pl-9 bg-input border-border/60 text-sm h-8"
          />
        </div>

        {/* Filtro por género */}
        <div className="flex gap-1.5 flex-wrap">
          <button
            onClick={() => setActiveGenre('')}
            className="text-xs px-2 py-0.5 rounded-full font-mono transition-all"
            style={{
              background: !activeGenre ? 'oklch(0.71 0.145 85)' : 'oklch(0.22 0.025 42)',
              color: !activeGenre ? 'oklch(0.12 0.022 42)' : 'oklch(0.60 0.025 60)',
              border: '1px solid transparent',
            }}
          >
            Todos
          </button>
          {genres.map((g) => (
            <button
              key={g}
              onClick={() => setActiveGenre(activeGenre === g ? '' : g)}
              className="text-xs px-2 py-0.5 rounded-full font-mono transition-all"
              style={{
                background: activeGenre === g ? 'oklch(0.71 0.145 85)' : 'oklch(0.22 0.025 42)',
                color: activeGenre === g ? 'oklch(0.12 0.022 42)' : 'oklch(0.60 0.025 60)',
                border: '1px solid transparent',
              }}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Lista con scroll (min-h-0 permite que el flex hijo haga scroll) */}
      <div className="flex-1 min-h-0 flex flex-col">
        <ScrollArea className="flex-1 min-h-0 custom-scrollbar overflow-x-hidden">
          <div className="p-2 space-y-1 min-w-0 w-full">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-2">
                <Skeleton className="w-11 h-11 rounded" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))
          ) : songs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm" style={{ color: 'oklch(0.50 0.025 60)' }}>
                No se encontraron canciones
              </p>
            </div>
          ) : (
            songs.map((song) => (
              <SongCard key={song.id} song={song} onSelect={handleSelect} />
            ))
          )}
          </div>
        </ScrollArea>
      </div>

      {/* Modal agregar a cola */}
      <AddToQueue
        song={selectedSong}
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedSong(null);
        }}
      />
    </div>
  );
}
