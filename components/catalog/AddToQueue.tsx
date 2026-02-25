'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useUserStore } from '@/lib/store/userStore';
import { useQueue } from '@/lib/hooks/useQueue';
import { formatDuration } from '@/lib/utils/youtube';
import { QUEUE_COST } from '@/lib/types';
import type { Song } from '@/lib/types';

interface AddToQueueProps {
  song: Song | null;
  open: boolean;
  onClose: () => void;
}

export function AddToQueue({ song, open, onClose }: AddToQueueProps) {
  const { user, updateCredits } = useUserStore();
  const { addToQueue } = useQueue();
  const [loading, setLoading] = useState(false);

  const canAfford = (user?.credits ?? 0) >= QUEUE_COST;

  async function handleAdd() {
    if (!song || !user) return;
    if (!canAfford) {
      toast.error('No tienes suficientes créditos.');
      return;
    }

    setLoading(true);
    const ok = await addToQueue(song.id);
    if (ok) {
      updateCredits(user.credits - QUEUE_COST);
      toast.success(`"${song.title}" agregada a la cola 🎵`);
      onClose();
    }
    setLoading(false);
  }

  if (!song) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-primary">Agregar a la cola</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Canción */}
          <div className="flex gap-3 items-start">
            <div className="rounded overflow-hidden shrink-0 w-16 h-16">
              {song.thumbnail ? (
                <Image
                  src={song.thumbnail}
                  alt={song.title}
                  width={64}
                  height={64}
                  className="object-cover w-full h-full"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground">
                    <path d="M9 18V5l12-2v13" />
                    <circle cx="6" cy="18" r="3" />
                    <circle cx="18" cy="16" r="3" />
                  </svg>
                </div>
              )}
            </div>

            <div className="min-w-0">
              <p className="font-semibold leading-tight font-display text-foreground">{song.title}</p>
              <p className="text-sm mt-0.5 text-primary">{song.artist}</p>
              <div className="flex gap-3 text-xs font-mono mt-1 text-muted-foreground">
                {song.duration && <span>{formatDuration(song.duration)}</span>}
                {song.genre && <span>· {song.genre}</span>}
              </div>
            </div>
          </div>

          {/* Costo */}
          <div className="rounded-lg p-3 flex items-center justify-between bg-background border border-border">
            <div>
              <p className="text-xs uppercase tracking-wider font-mono text-muted-foreground">Costo</p>
              <p className="text-lg font-bold font-mono text-primary">{QUEUE_COST} créditos</p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-wider font-mono text-muted-foreground">Tu saldo</p>
              <p className={`text-lg font-bold font-mono ${canAfford ? 'text-primary' : 'text-accent'}`}>
                {user?.credits ?? 0} créditos
              </p>
            </div>
          </div>

          {!canAfford && (
            <p className="text-xs text-center text-accent">
              No tienes suficientes créditos. Contacta al administrador para recargar.
            </p>
          )}

          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1 border-border text-muted-foreground">
              Cancelar
            </Button>
            <Button
              onClick={handleAdd}
              disabled={loading || !canAfford}
              className="flex-1 gold-button border-none font-semibold text-primary-foreground"
            >
              {loading ? 'Agregando...' : `Agregar por ${QUEUE_COST} 🪙`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
