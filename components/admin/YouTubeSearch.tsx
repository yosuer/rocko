'use client';

import { useState } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatDuration } from '@/lib/utils/youtube';

export interface YouTubeSearchItem {
  videoId: string;
  title: string;
  channelTitle: string;
  thumbnail: string;
  duration: number | null;
}

interface YouTubeSearchProps {
  /** Al hacer clic en "Agregar", se abre el formulario con estos datos para poder rellenar género. */
  onSelectToAdd: (item: YouTubeSearchItem) => void;
}

export function YouTubeSearch({ onSelectToAdd }: YouTubeSearchProps) {
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [items, setItems] = useState<YouTubeSearchItem[]>([]);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setSearching(true);
    setItems([]);
    try {
      const res = await fetch(`/api/admin/youtube-search?q=${encodeURIComponent(q)}`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error ?? 'Error al buscar');
        return;
      }
      const data = await res.json();
      setItems(data.items ?? []);
      if ((data.items?.length ?? 0) === 0) toast.info('No se encontraron videos');
    } catch {
      toast.error('Error de conexión');
    } finally {
      setSearching(false);
    }
  }

  const fieldStyle = {
    background: 'oklch(0.12 0.022 40)',
    borderColor: 'oklch(0.32 0.038 60 / 0.5)',
    color: 'oklch(0.93 0.030 80)',
  };

  return (
    <div
      className="rounded-xl p-4 space-y-4"
      style={{
        background: 'oklch(0.14 0.025 42)',
        border: '1px solid oklch(0.28 0.025 42)',
      }}
    >
      <h2
        className="text-lg font-semibold"
        style={{ fontFamily: 'var(--font-playfair)', color: 'oklch(0.82 0.13 88)' }}
      >
        Buscar en YouTube
      </h2>
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Nombre de la canción o artista..."
          className="flex-1"
          style={fieldStyle}
          disabled={searching}
        />
        <Button
          type="submit"
          disabled={searching || !query.trim()}
          className="gold-button border-none font-semibold shrink-0"
          style={{ color: 'oklch(0.12 0.022 42)' }}
        >
          {searching ? 'Buscando...' : 'Buscar'}
        </Button>
      </form>

      {items.length > 0 && (
        <ul className="space-y-2 max-h-[320px] overflow-y-auto">
          {items.map((item) => (
            <li
              key={item.videoId}
              className="flex items-center gap-3 py-2 px-3 rounded-lg"
              style={{
                background: 'oklch(0.12 0.022 40)',
                border: '1px solid oklch(0.22 0.025 42)',
              }}
            >
              {item.thumbnail && (
                <Image
                  src={item.thumbnail}
                  alt=""
                  width={56}
                  height={56}
                  className="rounded object-cover shrink-0"
                  unoptimized
                />
              )}
              <div className="flex-1 min-w-0">
                <p
                  className="text-sm font-medium truncate"
                  style={{ color: 'oklch(0.90 0.025 80)' }}
                >
                  {item.title}
                </p>
                <p className="text-xs truncate" style={{ color: 'oklch(0.60 0.025 60)' }}>
                  {item.channelTitle}
                  {item.duration != null && (
                    <span className="ml-2 font-mono">{formatDuration(item.duration)}</span>
                  )}
                </p>
              </div>
              <Button
                type="button"
                size="sm"
                onClick={() => onSelectToAdd(item)}
                className="gold-button border-none font-semibold shrink-0 text-xs"
                style={{ color: 'oklch(0.12 0.022 42)' }}
              >
                Agregar
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
