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
      <DialogContent
        className="max-w-sm"
        style={{
          background: 'oklch(0.16 0.028 42)',
          border: '1px solid oklch(0.71 0.145 85 / 0.3)',
        }}
      >
        <DialogHeader>
          <DialogTitle
            style={{ fontFamily: 'var(--font-playfair)', color: 'oklch(0.82 0.13 88)' }}
          >
            Agregar a la cola
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Canción */}
          <div className="flex gap-3 items-start">
            <div className="rounded overflow-hidden shrink-0" style={{ width: 64, height: 64 }}>
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
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ background: 'oklch(0.22 0.025 42)' }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="oklch(0.50 0.04 60)" strokeWidth="1.5">
                    <path d="M9 18V5l12-2v13" />
                    <circle cx="6" cy="18" r="3" />
                    <circle cx="18" cy="16" r="3" />
                  </svg>
                </div>
              )}
            </div>

            <div className="min-w-0">
              <p
                className="font-semibold leading-tight"
                style={{ fontFamily: 'var(--font-playfair)', color: 'oklch(0.93 0.030 80)' }}
              >
                {song.title}
              </p>
              <p className="text-sm mt-0.5" style={{ color: 'oklch(0.71 0.145 85)' }}>
                {song.artist}
              </p>
              <div className="flex gap-3 text-xs font-mono mt-1" style={{ color: 'oklch(0.55 0.025 60)' }}>
                {song.duration && <span>{formatDuration(song.duration)}</span>}
                {song.genre && <span>· {song.genre}</span>}
              </div>
            </div>
          </div>

          {/* Costo */}
          <div
            className="rounded-lg p-3 flex items-center justify-between"
            style={{
              background: 'oklch(0.12 0.022 40)',
              border: '1px solid oklch(0.28 0.025 42)',
            }}
          >
            <div>
              <p className="text-xs uppercase tracking-wider font-mono" style={{ color: 'oklch(0.55 0.025 60)' }}>
                Costo
              </p>
              <p className="text-lg font-bold font-mono" style={{ color: 'oklch(0.71 0.145 85)' }}>
                {QUEUE_COST} créditos
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-wider font-mono" style={{ color: 'oklch(0.55 0.025 60)' }}>
                Tu saldo
              </p>
              <p
                className="text-lg font-bold font-mono"
                style={{ color: canAfford ? 'oklch(0.68 0.16 145)' : 'oklch(0.58 0.175 25)' }}
              >
                {user?.credits ?? 0} créditos
              </p>
            </div>
          </div>

          {!canAfford && (
            <p className="text-xs text-center" style={{ color: 'oklch(0.58 0.175 25)' }}>
              No tienes suficientes créditos. Contacta al administrador para recargar.
            </p>
          )}

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              style={{ borderColor: 'oklch(0.35 0.038 60 / 0.5)', color: 'oklch(0.65 0.025 60)' }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleAdd}
              disabled={loading || !canAfford}
              className="flex-1 gold-button border-none font-semibold"
              style={{ color: 'oklch(0.12 0.022 42)' }}
            >
              {loading ? 'Agregando...' : `Agregar por ${QUEUE_COST} 🪙`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
