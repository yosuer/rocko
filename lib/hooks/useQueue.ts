'use client';

import { useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { useJukeboxStore } from '@/lib/store/jukeboxStore';
import type { QueueItem } from '@/lib/types';

export function useQueue() {
  const { queue, currentSong, setQueue, setCurrentSong, setIsLoading } =
    useJukeboxStore();

  const fetchQueue = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/queue');
      if (!res.ok) throw new Error('Error al cargar la cola');
      const data: QueueItem[] = await res.json();
      const playing = data.find((i) => i.status === 'playing') ?? null;
      const pending = data.filter((i) => i.status === 'pending');
      setCurrentSong(playing);
      setQueue(pending);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [setCurrentSong, setIsLoading, setQueue]);

  const addToQueue = useCallback(
    async (songId: string): Promise<boolean> => {
      try {
        const res = await fetch('/api/queue', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ song_id: songId }),
        });

        if (!res.ok) {
          const data = await res.json();
          toast.error(data.error ?? 'Error al agregar la canción');
          return false;
        }

        await fetchQueue();
        return true;
      } catch {
        toast.error('Error de conexión');
        return false;
      }
    },
    [fetchQueue]
  );

  const advanceQueue = useCallback(async () => {
    const res = await fetch('/api/queue/next', { method: 'POST' });
    if (res.ok) {
      await fetchQueue();
    }
  }, [fetchQueue]);

  // Suscripción Realtime a la tabla queue
  useEffect(() => {
    fetchQueue();

    const supabase = createClient();
    const channel = supabase
      .channel('queue-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'queue' },
        () => {
          fetchQueue();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchQueue]);

  return { queue, currentSong, addToQueue, advanceQueue, fetchQueue };
}
