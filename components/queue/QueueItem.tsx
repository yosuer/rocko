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
      className={`flex items-center gap-3 p-2 rounded-lg group transition-all ${isPlaying ? 'bg-primary/10 border border-primary/30' : 'bg-card/50 border border-border'}`}
    >
      {/* Número / estado */}
      <div
        className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono ${isPlaying ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
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
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground">
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
          </div>
        )}
      </div>

      {/* Info canción */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate leading-tight ${isPlaying ? 'text-primary' : 'text-foreground'}`}>
          {item.song?.title ?? 'Canción desconocida'}
        </p>
        <p className="text-xs truncate text-muted-foreground">
          {item.song?.artist}
          {item.requester && <span className="text-muted-foreground"> · {item.requester.username}</span>}
        </p>
      </div>

      {/* Duración */}
      <span className="shrink-0 text-xs font-mono text-muted-foreground">
        {formatDuration(item.song?.duration ?? null)}
      </span>

      {/* Votos */}
      <VoteButtons item={item} onVoted={onVoted} />
    </motion.div>
  );
}
