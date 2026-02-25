'use client';

import { AnimatePresence } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { QueueItem } from './QueueItem';
import { useJukeboxStore } from '@/lib/store/jukeboxStore';
import { useQueue } from '@/lib/hooks/useQueue';

export function QueueList() {
  const { queue, currentSong, isLoading } = useJukeboxStore();
  const { fetchQueue } = useQueue();

  const allItems = [
    ...(currentSong ? [currentSong] : []),
    ...queue,
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between shrink-0 border-b border-border">
        <h3 className="text-sm font-semibold uppercase tracking-wider font-display text-primary">
          Cola de reproducción
        </h3>
        <span className="text-xs font-mono text-muted-foreground">
          {allItems.length} {allItems.length === 1 ? 'canción' : 'canciones'}
        </span>
      </div>

      {/* Lista */}
      <ScrollArea className="flex-1 custom-scrollbar">
        <div className="p-2 space-y-1">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-2">
                <Skeleton className="w-6 h-6 rounded-full" />
                <Skeleton className="w-9 h-9 rounded" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-3 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))
          ) : allItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-3 text-muted-foreground">♪</div>
              <p className="text-sm text-muted-foreground">La cola está vacía</p>
              <p className="text-xs mt-1 text-muted-foreground/80">Agrega canciones del catálogo</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {allItems.map((item, index) => (
                <QueueItem
                  key={item.id}
                  item={item}
                  index={item.status === 'playing' ? 0 : index}
                  onVoted={fetchQueue}
                />
              ))}
            </AnimatePresence>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
