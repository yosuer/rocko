'use client';

import { useState } from 'react';
import { CreditHistory } from './CreditHistory';
import { useUserStore } from '@/lib/store/userStore';
import { QUEUE_COST } from '@/lib/types';

export function CreditDisplay() {
  const { user } = useUserStore();
  const [open, setOpen] = useState(false);

  if (!user) return null;

  const coinsLeft = Math.floor(user.credits / QUEUE_COST);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all bg-card border border-border hover:border-primary/60"
        title={`${coinsLeft} canciones disponibles · ver historial`}
      >
        <span style={{ fontSize: 14 }}>🪙</span>
        <span className="text-sm font-bold font-mono tabular-nums text-primary">
          {user.credits}
        </span>
      </button>

      <CreditHistory open={open} onClose={() => setOpen(false)} />
    </>
  );
}
