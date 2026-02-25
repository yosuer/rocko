'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { SongForm } from '@/components/admin/SongForm';
import { YouTubeSearch, type YouTubeSearchItem } from '@/components/admin/YouTubeSearch';
import { formatDuration } from '@/lib/utils/youtube';
import type { Song } from '@/lib/types';

export default function AdminSongsPage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [editSong, setEditSong] = useState<Song | null>(null);
  const [pendingYouTubeItem, setPendingYouTubeItem] = useState<YouTubeSearchItem | null>(null);
  const [showForm, setShowForm] = useState(false);

  const fetchSongs = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/songs');
    if (res.ok) setSongs(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { fetchSongs(); }, [fetchSongs]);

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar esta canción del catálogo?')) return;
    const res = await fetch(`/api/admin/songs/${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success('Canción eliminada');
      fetchSongs();
    } else {
      toast.error('Error al eliminar');
    }
  }

  function handleEdit(song: Song) {
    setEditSong(song);
    setShowForm(true);
  }

  function handleNew() {
    setEditSong(null);
    setPendingYouTubeItem(null);
    setShowForm(true);
  }

  function handleSelectFromYouTube(item: YouTubeSearchItem) {
    setEditSong(null);
    setPendingYouTubeItem(item);
    setShowForm(true);
  }

  function handleFormSuccess() {
    setShowForm(false);
    setPendingYouTubeItem(null);
    fetchSongs();
  }

  function handleFormOpenChange(open: boolean) {
    if (!open) setPendingYouTubeItem(null);
    setShowForm(open);
  }

  const formInitialData = pendingYouTubeItem
    ? {
        title: pendingYouTubeItem.title,
        artist: pendingYouTubeItem.channelTitle,
        youtube_url: `https://www.youtube.com/watch?v=${pendingYouTubeItem.videoId}`,
        duration: pendingYouTubeItem.duration,
      }
    : undefined;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-3xl font-bold"
            style={{ fontFamily: 'var(--font-playfair)', color: 'oklch(0.82 0.13 88)' }}
          >
            Canciones
          </h1>
          <p className="text-sm mt-1" style={{ color: 'oklch(0.55 0.025 60)' }}>
            {songs.length} canciones en el catálogo
          </p>
        </div>
        <Button
          onClick={handleNew}
          className="gold-button border-none font-semibold"
          style={{ color: 'oklch(0.12 0.022 42)' }}
        >
          + Nueva canción
        </Button>
      </div>

      <YouTubeSearch onSelectToAdd={handleSelectFromYouTube} />

      {/* Tabla */}
      <div
        className="rounded-xl overflow-hidden"
        style={{
          background: 'oklch(0.16 0.028 42)',
          border: '1px solid oklch(0.28 0.025 42)',
        }}
      >
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid oklch(0.25 0.025 42)' }}>
              {['Canción', 'Artista', 'Género', 'Duración', 'Plays', 'Acciones'].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs uppercase tracking-wider font-mono"
                  style={{ color: 'oklch(0.55 0.025 60)' }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 6 }).map((__, j) => (
                      <td key={j} className="px-4 py-3">
                        <Skeleton className="h-4 w-full" />
                      </td>
                    ))}
                  </tr>
                ))
              : songs.map((song) => (
                  <tr
                    key={song.id}
                    style={{ borderBottom: '1px solid oklch(0.20 0.022 40)' }}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {song.thumbnail && (
                          <Image
                            src={song.thumbnail}
                            alt={song.title}
                            width={36}
                            height={36}
                            className="rounded object-cover shrink-0"
                            unoptimized
                          />
                        )}
                        <span
                          className="font-medium truncate max-w-[180px]"
                          style={{ color: 'oklch(0.90 0.025 80)' }}
                        >
                          {song.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3" style={{ color: 'oklch(0.71 0.145 85)' }}>
                      {song.artist}
                    </td>
                    <td className="px-4 py-3" style={{ color: 'oklch(0.60 0.025 60)' }}>
                      {song.genre ?? '—'}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs" style={{ color: 'oklch(0.55 0.025 60)' }}>
                      {formatDuration(song.duration ?? null)}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs" style={{ color: 'oklch(0.60 0.08 80)' }}>
                      {song.plays_count}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(song)}
                          className="text-xs px-2 py-1 rounded"
                          style={{ background: 'oklch(0.22 0.025 42)', color: 'oklch(0.71 0.145 85)' }}
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(song.id)}
                          className="text-xs px-2 py-1 rounded"
                          style={{ background: 'oklch(0.22 0.025 42)', color: 'oklch(0.58 0.175 25)' }}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {/* Modal formulario */}
      <Dialog open={showForm} onOpenChange={handleFormOpenChange}>
        <DialogContent
          style={{
            background: 'oklch(0.16 0.028 42)',
            border: '1px solid oklch(0.71 0.145 85 / 0.3)',
          }}
        >
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'var(--font-playfair)', color: 'oklch(0.82 0.13 88)' }}>
              {editSong ? 'Editar canción' : pendingYouTubeItem ? 'Agregar canción (completa género)' : 'Nueva canción'}
            </DialogTitle>
          </DialogHeader>
          <SongForm
            key={editSong?.id ?? formInitialData?.youtube_url ?? 'new'}
            song={editSong ?? undefined}
            initialData={formInitialData}
            onSuccess={handleFormSuccess}
            onCancel={() => handleFormOpenChange(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
