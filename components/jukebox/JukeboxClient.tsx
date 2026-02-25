'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TopBar } from '@/components/layout/TopBar';
import { JukeboxFrame } from './JukeboxFrame';
import { SongCatalog } from '@/components/catalog/SongCatalog';
import { QueueList } from '@/components/queue/QueueList';
import { usePresence } from '@/lib/hooks/usePresence';
import { useIsDesktop } from '@/lib/hooks/useMediaQuery';

interface JukeboxClientProps {
  isAdmin: boolean;
}

export function JukeboxClient({ isAdmin }: JukeboxClientProps) {
  usePresence();
  const isDesktop = useIsDesktop();

  return (
    <div className="flex flex-col h-screen overflow-hidden wood-texture">
      <TopBar />

      {/* Solo una rama en el DOM para evitar dos reproductores YouTube (duplicado de audio) */}
      {isDesktop ? (
        <div className="flex-1 overflow-hidden grid grid-cols-[360px_1fr_360px]">
          <aside
            className="flex flex-col overflow-hidden min-h-0"
            style={{
              borderRight: '1px solid oklch(0.25 0.025 42)',
              background: 'oklch(0.12 0.022 40 / 0.8)',
            }}
          >
            <SongCatalog />
          </aside>
          <main
            className="flex flex-col items-center justify-center p-6 overflow-y-auto"
            style={{ background: 'oklch(0.10 0.018 40 / 0.6)' }}
          >
            <JukeboxFrame isAdmin={isAdmin} />
          </main>
          <aside
            className="flex flex-col overflow-hidden min-h-0"
            style={{
              borderLeft: '1px solid oklch(0.25 0.025 42)',
              background: 'oklch(0.12 0.022 40 / 0.8)',
            }}
          >
            <QueueList />
          </aside>
        </div>
      ) : (
        <div className="flex-1 overflow-hidden flex flex-col">
        <Tabs defaultValue="player" className="flex flex-col flex-1 overflow-hidden">
          <TabsList
            className="shrink-0 rounded-none border-b h-11 gap-0 p-0"
            style={{
              background: 'oklch(0.14 0.025 42)',
              borderColor: 'oklch(0.25 0.025 42)',
            }}
          >
            {[
              { value: 'catalog', label: '🎵 Catálogo' },
              { value: 'player',  label: '🎶 Rockola' },
              { value: 'queue',   label: '📋 Cola' },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex-1 h-full rounded-none text-xs font-mono data-[state=active]:border-b-2"
                style={{
                  borderBottomColor: 'oklch(0.71 0.145 85)',
                  color: 'oklch(0.60 0.025 60)',
                }}
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="catalog" className="flex-1 overflow-hidden m-0">
            <div className="h-full" style={{ background: 'oklch(0.12 0.022 40 / 0.8)' }}>
              <SongCatalog />
            </div>
          </TabsContent>

          <TabsContent
            value="player"
            className="flex-1 overflow-y-auto m-0 flex items-center justify-center p-4"
            style={{ background: 'oklch(0.10 0.018 40 / 0.6)' }}
          >
            <JukeboxFrame isAdmin={isAdmin} />
          </TabsContent>

          <TabsContent value="queue" className="flex-1 overflow-hidden m-0">
            <div className="h-full" style={{ background: 'oklch(0.12 0.022 40 / 0.8)' }}>
              <QueueList />
            </div>
          </TabsContent>
        </Tabs>
        </div>
      )}
    </div>
  );
}
