'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { VoteButtons } from './VoteButtons';
import { formatDuration } from '@/lib/utils/youtube';
import type { QueueItem as QueueItemType } from '@/lib/types';

interface QueueItemProps {
  item: QueueItemType;
  index: number;
  onVoted?: () => void;
}

export function QueueItem({ item, index, onVoted }: QueueItemProps) {
  const isPlaying = item.status === 'playing';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
      className="flex items-center gap-3 p-2 rounded-lg group"
      style={{
        background: isPlaying
          ? 'oklch(0.71 0.145 85 / 0.08)'
          : 'oklch(0.18 0.025 42 / 0.5)',
        border: `1px solid ${isPlaying ? 'oklch(0.71 0.145 85 / 0.3)' : 'oklch(0.28 0.025 42)'}`,
        transition: 'all 0.2s',
      }}
    >
      {/* Número / estado */}
      <div
        className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono"
        style={{
          background: isPlaying ? 'oklch(0.71 0.145 85)' : 'oklch(0.25 0.025 42)',
          color: isPlaying ? 'oklch(0.12 0.022 42)' : 'oklch(0.60 0.025 60)',
        }}
      >
        {isPlaying ? (
          <span className="animate-pulse">♪</span>
        ) : (
          <span>{index + 1}</span>
        )}
      </div>

      {/* Thumbnail */}
      <div className="shrink-0 w-9 h-9 rounded overflow-hidden">
        {item.song?.thumbnail ? (
          <Image
            src={item.song.thumbnail}
            alt={item.song.title}
            width={36}
            height={36}
            className="w-full h-full object-cover"
            unoptimized
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: 'oklch(0.20 0.025 42)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="oklch(0.50 0.04 60)" strokeWidth="1.5">
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
          </div>
        )}
      </div>

      {/* Info canción */}
      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-medium truncate leading-tight"
          style={{ color: isPlaying ? 'oklch(0.82 0.13 88)' : 'oklch(0.88 0.025 80)' }}
        >
          {item.song?.title ?? 'Canción desconocida'}
        </p>
        <p className="text-xs truncate" style={{ color: 'oklch(0.55 0.025 60)' }}>
          {item.song?.artist}
          {item.requester && (
            <span style={{ color: 'oklch(0.60 0.08 80)' }}> · {item.requester.username}</span>
          )}
        </p>
      </div>

      {/* Duración */}
      <span
        className="shrink-0 text-xs font-mono"
        style={{ color: 'oklch(0.50 0.025 60)' }}
      >
        {formatDuration(item.song?.duration ?? null)}
      </span>

      {/* Votos */}
      <VoteButtons item={item} onVoted={onVoted} />
    </motion.div>
  );
}
