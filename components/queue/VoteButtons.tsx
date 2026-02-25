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
        className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-mono transition-all disabled:opacity-50"
        style={{
          background: userVote.up ? 'oklch(0.71 0.145 85 / 0.2)' : 'transparent',
          border: `1px solid ${userVote.up ? 'oklch(0.71 0.145 85 / 0.6)' : 'oklch(0.35 0.038 60 / 0.4)'}`,
          color: userVote.up ? 'oklch(0.82 0.13 88)' : 'oklch(0.60 0.025 60)',
        }}
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
          className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-mono transition-all disabled:opacity-50"
          style={{
            background: userVote.skip ? 'oklch(0.48 0.175 25 / 0.2)' : 'transparent',
            border: `1px solid ${userVote.skip ? 'oklch(0.48 0.175 25 / 0.6)' : 'oklch(0.35 0.038 60 / 0.4)'}`,
            color: userVote.skip ? 'oklch(0.65 0.175 25)' : 'oklch(0.60 0.025 60)',
          }}
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
