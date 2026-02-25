'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import type { VoteType } from '@/lib/types';

export function useVoting() {
  const [votingIds, setVotingIds] = useState<Set<string>>(new Set());

  const castVote = useCallback(
    async (queueId: string, voteType: VoteType): Promise<'added' | 'removed' | null> => {
      if (votingIds.has(`${queueId}-${voteType}`)) return null;

      setVotingIds((prev) => new Set(prev).add(`${queueId}-${voteType}`));

      try {
        const res = await fetch('/api/votes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ queue_id: queueId, vote_type: voteType }),
        });

        const data = await res.json();
        if (!res.ok) {
          toast.error(data.error ?? 'Error al votar');
          return null;
        }

        return data.action as 'added' | 'removed';
      } catch {
        toast.error('Error de conexión al votar');
        return null;
      } finally {
        setVotingIds((prev) => {
          const next = new Set(prev);
          next.delete(`${queueId}-${voteType}`);
          return next;
        });
      }
    },
    [votingIds]
  );

  const isVoting = (queueId: string, voteType: VoteType) =>
    votingIds.has(`${queueId}-${voteType}`);

  return { castVote, isVoting };
}
