'use client';

/** Rockola vintage: marco de madera, franja cromada, LEDs y borde neón dorado */
export function ClassicFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="jukebox-frame rounded-3xl p-1 w-full max-w-sm mx-auto"
      style={{ minWidth: 280 }}
    >
      <div className="metal-panel rounded-t-2xl px-4 py-2 flex items-center justify-between border-b border-border/50">
        <div className="flex items-center gap-2">
          {['var(--accent)', 'var(--primary)', 'var(--secondary)'].map((color, i) => (
            <div
              key={i}
              className="rounded-full"
              style={{ width: 8, height: 8, background: color, boxShadow: `0 0 6px ${color}` }}
            />
          ))}
        </div>
        <span className="text-xs font-mono tracking-widest uppercase text-muted-foreground">
          ROCKO v1.0
        </span>
        <div className="flex items-center gap-2">
          {['var(--secondary)', 'var(--primary)', 'var(--accent)'].map((color, i) => (
            <div
              key={i}
              className="rounded-full"
              style={{ width: 8, height: 8, background: color, boxShadow: `0 0 6px ${color}` }}
            />
          ))}
        </div>
      </div>
      <div className="rounded-b-2xl p-5 wood-texture bg-background/95 border-t border-border/30">
        <div className="rounded-xl p-4 neon-gold bg-card border border-border">
          {children}
        </div>
        <div className="flex justify-center gap-3 mt-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="rounded-full"
              style={{
                width: 6,
                height: 6,
                background: i % 2 === 0 ? 'color-mix(in oklch, var(--primary) 60%, transparent)' : 'color-mix(in oklch, var(--accent) 50%, transparent)',
                boxShadow: i % 2 === 0 ? '0 0 6px var(--primary)' : '0 0 6px var(--accent)',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
