'use client';

/** Boombox / radio años 80: forma rectangular, “parlantes” laterales, pantalla central con glow neón */
export function NeonFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="w-full max-w-sm mx-auto rounded-2xl overflow-hidden border-2 border-primary/60 bg-card"
      style={{
        minWidth: 280,
        boxShadow: '0 0 24px color-mix(in oklch, var(--primary) 30%, transparent), 0 0 48px color-mix(in oklch, var(--accent) 15%, transparent), inset 0 0 60px rgba(0,0,0,0.5)',
      }}
    >
      {/* Franja superior tipo display / antena */}
      <div
        className="h-8 flex items-center justify-center gap-2 border-b border-primary/40"
        style={{
          background: 'linear-gradient(180deg, color-mix(in oklch, var(--primary) 12%, transparent) 0%, transparent 100%)',
          boxShadow: '0 0 12px var(--primary)',
        }}
      >
        <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-primary/90">
          ROCKO FM
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" style={{ boxShadow: '0 0 6px var(--primary)' }} />
      </div>

      <div className="flex min-h-[320px]">
        {/* “Parlante” izquierdo — rejilla decorativa */}
        <div
          className="w-12 shrink-0 flex flex-col items-center justify-center gap-1 py-4 border-r border-primary/30"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, color-mix(in oklch, var(--primary) 8%, transparent) 3px, color-mix(in oklch, var(--primary) 8%, transparent) 4px)',
            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.6)',
          }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="w-6 h-0.5 rounded-full opacity-60"
              style={{ background: 'var(--primary)', boxShadow: '0 0 4px var(--primary)' }}
            />
          ))}
        </div>

        {/* Zona central: reproductor */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 min-w-0">
          <div
            className="w-full rounded-xl p-4 border border-primary/50"
            style={{
              background: 'color-mix(in oklch, var(--background) 90%, var(--primary) 5%)',
              boxShadow: '0 0 16px color-mix(in oklch, var(--primary) 25%, transparent), inset 0 0 20px rgba(0,0,0,0.4)',
            }}
          >
            {children}
          </div>
        </div>

        {/* “Parlante” derecho */}
        <div
          className="w-12 shrink-0 flex flex-col items-center justify-center gap-1 py-4 border-l border-primary/30"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, color-mix(in oklch, var(--accent) 8%, transparent) 3px, color-mix(in oklch, var(--accent) 8%, transparent) 4px)',
            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.6)',
          }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="w-6 h-0.5 rounded-full opacity-60"
              style={{ background: 'var(--accent)', boxShadow: '0 0 4px var(--accent)' }}
            />
          ))}
        </div>
      </div>

      {/* Base tipo rejilla inferior */}
      <div
        className="h-2 border-t border-primary/40"
        style={{
          background: 'linear-gradient(90deg, transparent, color-mix(in oklch, var(--primary) 15%, transparent) 50%, transparent)',
        }}
      />
    </div>
  );
}
