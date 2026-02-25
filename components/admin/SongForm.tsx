'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { extractYouTubeId, getThumbnailUrl } from '@/lib/utils/youtube';
import type { Song } from '@/lib/types';

/** Datos iniciales al agregar desde búsqueda de YouTube (permite rellenar género). */
export interface SongFormInitialData {
  title: string;
  artist: string;
  youtube_url: string;
  duration: number | null;
}

interface SongFormProps {
  song?: Song;
  /** Al agregar desde YouTube, pre-rellena título, artista, URL y duración. */
  initialData?: SongFormInitialData;
  onSuccess: () => void;
  onCancel: () => void;
}

export function SongForm({ song, initialData, onSuccess, onCancel }: SongFormProps) {
  const [form, setForm] = useState({
    title:       song?.title       ?? initialData?.title       ?? '',
    artist:      song?.artist      ?? initialData?.artist      ?? '',
    youtube_url: song?.youtube_url ?? initialData?.youtube_url ?? '',
    genre:       song?.genre       ?? '',
    duration:       song?.duration?.toString() ?? (initialData?.duration != null ? String(initialData.duration) : ''),
    lyrics:         song?.lyrics      ?? '',
    lyrics_offset:   song?.lyrics_offset != null ? String(song.lyrics_offset) : '0',
  });
  const [loading, setLoading] = useState(false);
  const [loadingLyrics, setLoadingLyrics] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Auto-rellenar thumbnail cuando se pega una URL de YouTube
    if (name === 'youtube_url') {
      const id = extractYouTubeId(value);
      if (id && !form.title) {
        // Solo auto-fill si no hay título todavía
      }
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const youtubeId = extractYouTubeId(form.youtube_url);
    if (!youtubeId) {
      toast.error('URL de YouTube inválida');
      return;
    }

    setLoading(true);
    const payload = {
      title: form.title,
      artist: form.artist,
      youtube_url: form.youtube_url,
      youtube_id: youtubeId,
      thumbnail: getThumbnailUrl(youtubeId),
      genre: form.genre || null,
      duration: form.duration ? parseInt(form.duration, 10) : null,
      lyrics: form.lyrics.trim() || null,
      lyrics_offset: parseInt(form.lyrics_offset, 10) || 0,
    };

    const url = song ? `/api/admin/songs/${song.id}` : '/api/admin/songs';
    const method = song ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      toast.success(song ? 'Canción actualizada' : 'Canción agregada al catálogo');
      onSuccess();
    } else {
      const data = await res.json();
      toast.error(data.error ?? 'Error al guardar');
    }
    setLoading(false);
  }

  const fieldStyle = {
    background: 'oklch(0.12 0.022 40)',
    borderColor: 'oklch(0.32 0.038 60 / 0.5)',
    color: 'oklch(0.93 0.030 80)',
  };

  const labelStyle = {
    color: 'oklch(0.65 0.025 60)',
    fontSize: '0.7rem',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    fontFamily: 'var(--font-jetbrains)',
  };

  async function handleFetchLyrics() {
    if (!form.title.trim() || !form.artist.trim()) {
      toast.error('Completa título y artista para buscar la letra');
      return;
    }
    setLoadingLyrics(true);
    try {
      const params = new URLSearchParams({
        track_name: form.title.trim(),
        artist_name: form.artist.trim(),
      });
      if (form.duration) params.set('duration', form.duration);
      const res = await fetch(`/api/lyrics/search?${params}`);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.error ?? 'No se encontraron letras');
        return;
      }
      if (data.lyrics) {
        setForm((prev) => ({
          ...prev,
          lyrics: data.lyrics,
        }));
        toast.success('Letra obtenida desde LRCLIB');
      } else {
        toast.error('No hay letra disponible');
      }
    } catch {
      toast.error('Error al buscar la letra');
    } finally {
      setLoadingLyrics(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label style={labelStyle}>Título</Label>
          <Input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            placeholder="Bohemian Rhapsody"
            style={fieldStyle}
          />
        </div>
        <div className="space-y-1.5">
          <Label style={labelStyle}>Artista</Label>
          <Input
            name="artist"
            value={form.artist}
            onChange={handleChange}
            required
            placeholder="Queen"
            style={fieldStyle}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label style={labelStyle}>URL de YouTube</Label>
        <Input
          name="youtube_url"
          value={form.youtube_url}
          onChange={handleChange}
          required
          placeholder="https://www.youtube.com/watch?v=..."
          style={fieldStyle}
        />
        {form.youtube_url && !extractYouTubeId(form.youtube_url) && (
          <p className="text-xs" style={{ color: 'oklch(0.58 0.175 25)' }}>
            URL no reconocida como YouTube válida
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <Label style={labelStyle}>Letra (formato LRC)</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleFetchLyrics}
            disabled={loadingLyrics || !form.title.trim() || !form.artist.trim()}
            className="shrink-0 border-border text-muted-foreground"
          >
            {loadingLyrics ? 'Buscando…' : 'Obtener letra'}
          </Button>
        </div>
        <textarea
          name="lyrics"
          value={form.lyrics}
          onChange={handleChange}
          placeholder={'[00:12.50] Primera línea\n[00:17.00] Segunda línea'}
          rows={6}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm font-mono resize-y border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <p className="text-xs text-muted-foreground">
          Formato LRC: [mm:ss.xx] seguido del texto. Usa «Obtener letra» para buscar en LRCLIB (gratis) o pega tu propio LRC.
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          <Label style={labelStyle} className="shrink-0">Desplazamiento (seg)</Label>
          <Input
            name="lyrics_offset"
            type="number"
            value={form.lyrics_offset}
            onChange={handleChange}
            placeholder="0"
            className="w-24 border-border bg-background text-foreground"
          />
          <span className="text-xs text-muted-foreground">
            Si la letra se adelanta (ej. LRC con intro que tu vídeo no tiene), pon ej. 38 para retrasarla.
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label style={labelStyle}>Género</Label>
          <Input
            name="genre"
            value={form.genre}
            onChange={handleChange}
            placeholder="Rock"
            style={fieldStyle}
          />
        </div>
        <div className="space-y-1.5">
          <Label style={labelStyle}>Duración (segundos)</Label>
          <Input
            name="duration"
            type="number"
            value={form.duration}
            onChange={handleChange}
            placeholder="240"
            min={1}
            style={fieldStyle}
          />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
          style={{ borderColor: 'oklch(0.32 0.038 60 / 0.5)', color: 'oklch(0.60 0.025 60)' }}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="flex-1 gold-button border-none font-semibold"
          style={{ color: 'oklch(0.12 0.022 42)' }}
        >
          {loading ? 'Guardando...' : song ? 'Actualizar' : 'Agregar canción'}
        </Button>
      </div>
    </form>
  );
}
