'use client';

import { useState } from 'react';
import { useVoting } from '@/lib/hooks/useVoting';
import type { QueueItem } from '@/lib/types';

interface VoteButtonsProps {
  item: QueueItem;
  onVoted?: () => void;
}

export function VoteButtons({ item, onVoted }: VoteButtonsProps) {
  const { castVote, isVoting } = useVoting();
  const [userVote, setUserVote] = useState<{ skip: boolean; up: boolean }>({
    skip: item.user_vote === 'skip',
    up: item.user_vote === 'up',
  });

  async function handleVote(type: 'skip' | 'up') {
    const result = await castVote(item.id, type);
    if (result === 'added') {
      setUserVote((prev) => ({ ...prev, [type]: true }));
    } else if (result === 'removed') {
      setUserVote((prev) => ({ ...prev, [type]: false }));
    }
    onVoted?.();
  }

  return (
    <div className="flex items-center gap-1">
      {/* Upvote */}
      <button
        onClick={() => handleVote('up')}
        disabled={isVoting(item.id, 'up')}
        className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-mono transition-all disabled:opacity-50 border ${userVote.up ? 'bg-primary/20 border-primary/60 text-primary' : 'bg-transparent border-border text-muted-foreground'}`}
        title="Subir en la cola"
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="12,2 22,20 2,20" />
        </svg>
        <span>{item.votes_up}</span>
      </button>

      {/* Skip vote (solo para canción actual) */}
      {item.status === 'playing' && (
        <button
          onClick={() => handleVote('skip')}
          disabled={isVoting(item.id, 'skip')}
          className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-mono transition-all disabled:opacity-50 border ${userVote.skip ? 'bg-accent/20 border-accent/60 text-accent' : 'bg-transparent border-border text-muted-foreground'}`}
          title="Votar para saltar"
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polygon points="5,4 13,12 5,20" />
            <line x1="19" y1="4" x2="19" y2="20" />
          </svg>
          <span>{item.votes_skip}</span>
        </button>
      )}
    </div>
  );
}
