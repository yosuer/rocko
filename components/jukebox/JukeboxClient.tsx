'use client';

import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TopBar } from '@/components/layout/TopBar';
import { JukeboxFrame } from './JukeboxFrame';
import { SongCatalog } from '@/components/catalog/SongCatalog';
import { QueueList } from '@/components/queue/QueueList';
import { usePresence } from '@/lib/hooks/usePresence';
import { useIsDesktop } from '@/lib/hooks/useMediaQuery';
import { cn } from '@/lib/utils';

interface JukeboxClientProps {
  isAdmin: boolean;
}

export function JukeboxClient({ isAdmin }: JukeboxClientProps) {
  usePresence();
  const isDesktop = useIsDesktop();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mobileTab, setMobileTab] = useState('player');

  const handleToggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
  };

  // Contenedor del reproductor: mismo nodo siempre para no desmontar YouTube ni reiniciar la canción
  const playerWrapperClass = cn(
    isFullscreen && 'fixed inset-0 z-50 flex items-center justify-center bg-background p-4',
    !isFullscreen && isDesktop && 'flex-1 flex flex-col items-center justify-center min-w-0 p-6 overflow-y-auto bg-background/60',
    !isFullscreen && !isDesktop && 'flex-1 flex flex-col items-center justify-center min-h-0 min-w-0 overflow-y-auto p-4'
  );

  const playerWrapperStyle =
    !isFullscreen && !isDesktop ? { background: 'oklch(0.10 0.018 40 / 0.6)' } : undefined;

  return (
    <div className={cn('flex flex-col h-screen overflow-hidden', !isFullscreen && 'wood-texture')}>
      {!isFullscreen && <TopBar />}

      <div
        className={cn(
          'flex-1 flex overflow-hidden min-h-0',
          !isFullscreen && !isDesktop && 'flex-col'
        )}
      >
        {/* Desktop: paneles laterales solo cuando no es fullscreen */}
        {!isFullscreen && isDesktop && (
          <aside className="flex flex-col overflow-hidden min-h-0 border-r border-border bg-card/80 w-[360px] shrink-0">
            <SongCatalog />
          </aside>
        )}

        {/* Mobile: tabs arriba; el reproductor está siempre debajo (mismo nodo) */}
        {!isFullscreen && !isDesktop && (
          <div
            className={cn(
              'flex flex-col min-h-0 min-w-0',
              (mobileTab === 'catalog' || mobileTab === 'queue') && 'flex-1'
            )}
          >
            <Tabs value={mobileTab} onValueChange={setMobileTab} className="flex flex-col flex-1 min-h-0">
              <TabsList className="shrink-0 rounded-none border-b border-border h-11 gap-0 p-0 bg-card">
                {[
                  { value: 'catalog', label: '🎵 Catálogo' },
                  { value: 'player', label: '🎶 Rockola' },
                  { value: 'queue', label: '📋 Cola' },
                ].map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="flex-1 h-full rounded-none text-xs font-mono text-muted-foreground data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              {mobileTab === 'catalog' && (
                <div className="flex-1 overflow-hidden min-h-0" style={{ background: 'oklch(0.12 0.022 40 / 0.8)' }}>
                  <SongCatalog />
                </div>
              )}
              {mobileTab === 'queue' && (
                <div className="flex-1 overflow-hidden min-h-0" style={{ background: 'oklch(0.12 0.022 40 / 0.8)' }}>
                  <QueueList />
                </div>
              )}
            </Tabs>
          </div>
        )}

        {/* Siempre el mismo nodo: evita reinicio al entrar/salir de fullscreen */}
        <div
          className={cn(
            playerWrapperClass,
            !isFullscreen && !isDesktop && mobileTab !== 'player' && 'hidden'
          )}
          style={playerWrapperStyle}
        >
          <JukeboxFrame
            isAdmin={isAdmin}
            isFullscreen={isFullscreen}
            onToggleFullscreen={handleToggleFullscreen}
          />
        </div>

        {!isFullscreen && isDesktop && (
          <aside className="flex flex-col overflow-hidden min-h-0 border-l border-border bg-card/80 w-[360px] shrink-0">
            <QueueList />
          </aside>
        )}
      </div>
    </div>
  );
}
