'use client';

import { NowPlaying } from './NowPlaying';

interface JukeboxFrameProps {
  isAdmin?: boolean;
}

export function JukeboxFrame({ isAdmin = false }: JukeboxFrameProps) {
  return (
    <div
      className="jukebox-frame rounded-3xl p-1 w-full max-w-sm mx-auto"
      style={{ minWidth: 280 }}
    >
      {/* Header cromado con nombre de la rockola */}
      <div
        className="metal-panel rounded-t-2xl px-4 py-2 flex items-center justify-between"
        style={{
          borderBottom: '1px solid oklch(0.45 0.010 220 / 0.5)',
        }}
      >
        <div className="flex items-center gap-2">
          {/* Luces LED decorativas */}
          {['oklch(0.58 0.18 25)', 'oklch(0.71 0.145 85)', 'oklch(0.55 0.18 145)'].map(
            (color, i) => (
              <div
                key={i}
                className="rounded-full"
                style={{
                  width: 8,
                  height: 8,
                  background: color,
                  boxShadow: `0 0 6px ${color}`,
                }}
              />
            )
          )}
        </div>

        <span
          className="text-xs font-mono tracking-widest uppercase"
          style={{ color: 'oklch(0.65 0.015 220)' }}
        >
          ROCKO v1.0
        </span>

        <div className="flex items-center gap-2">
          {/* Luces decorativas derecha */}
          {['oklch(0.55 0.18 145)', 'oklch(0.71 0.145 85)', 'oklch(0.58 0.18 25)'].map(
            (color, i) => (
              <div
                key={i}
                className="rounded-full"
                style={{
                  width: 8,
                  height: 8,
                  background: color,
                  boxShadow: `0 0 6px ${color}`,
                }}
              />
            )
          )}
        </div>
      </div>

      {/* Área principal del reproductor */}
      <div
        className="rounded-b-2xl p-5 wood-texture"
        style={{
          background: 'oklch(0.13 0.022 40)',
          borderTop: '1px solid oklch(0.71 0.145 85 / 0.08)',
        }}
      >
        {/* Borde neón interno */}
        <div
          className="rounded-xl p-4 neon-gold"
          style={{
            background: 'oklch(0.10 0.018 40)',
            border: '1px solid oklch(0.71 0.145 85 / 0.25)',
          }}
        >
          <NowPlaying isAdmin={isAdmin} />
        </div>

        {/* Decoraciones visuales jukebox */}
        <div className="flex justify-center gap-3 mt-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="rounded-full"
              style={{
                width: 6,
                height: 6,
                background:
                  i % 2 === 0
                    ? 'oklch(0.71 0.145 85 / 0.6)'
                    : 'oklch(0.48 0.175 25 / 0.5)',
                boxShadow:
                  i % 2 === 0
                    ? '0 0 6px oklch(0.71 0.145 85 / 0.5)'
                    : '0 0 6px oklch(0.48 0.175 25 / 0.4)',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
