'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TopBar } from '@/components/layout/TopBar';
import { JukeboxFrame } from './JukeboxFrame';
import { SongCatalog } from '@/components/catalog/SongCatalog';
import { QueueList } from '@/components/queue/QueueList';
import { usePresence } from '@/lib/hooks/usePresence';

interface JukeboxClientProps {
  isAdmin: boolean;
}

export function JukeboxClient({ isAdmin }: JukeboxClientProps) {
  // Registra presencia del usuario en el canal
  usePresence();

  return (
    <div className="flex flex-col h-screen overflow-hidden wood-texture">
      <TopBar />

      {/* Layout desktop: 3 columnas */}
      <div className="flex-1 overflow-hidden hidden lg:grid lg:grid-cols-[320px_1fr_320px]">
        {/* Panel izquierdo — Catálogo */}
        <aside
          className="flex flex-col overflow-hidden"
          style={{
            borderRight: '1px solid oklch(0.25 0.025 42)',
            background: 'oklch(0.12 0.022 40 / 0.8)',
          }}
        >
          <SongCatalog />
        </aside>

        {/* Panel central — Reproductor */}
        <main
          className="flex flex-col items-center justify-center p-6 overflow-y-auto"
          style={{ background: 'oklch(0.10 0.018 40 / 0.6)' }}
        >
          <JukeboxFrame isAdmin={isAdmin} />
        </main>

        {/* Panel derecho — Cola */}
        <aside
          className="flex flex-col overflow-hidden"
          style={{
            borderLeft: '1px solid oklch(0.25 0.025 42)',
            background: 'oklch(0.12 0.022 40 / 0.8)',
          }}
        >
          <QueueList />
        </aside>
      </div>

      {/* Layout tablet/móvil: tabs */}
      <div className="flex-1 overflow-hidden lg:hidden flex flex-col">
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
    </div>
  );
}
