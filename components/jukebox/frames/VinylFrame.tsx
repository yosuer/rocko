'use client';

/** Tocadiscos / sala de discos: marco cálido, detalle de surco de vinilo y sensación de plato */
export function VinylFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="w-full max-w-sm mx-auto rounded-3xl overflow-hidden border-2 bg-card"
      style={{
        minWidth: 280,
        borderColor: 'color-mix(in oklch, var(--primary) 35%, var(--border))',
        boxShadow: '0 8px 32px rgba(0,0,0,0.25), 0 0 0 1px color-mix(in oklch, var(--primary) 15%, transparent) inset',
      }}
    >
      {/* Cabecera tipo placa del tocadiscos */}
      <div
        className="px-4 py-2.5 flex items-center justify-between border-b"
        style={{
          borderColor: 'color-mix(in oklch, var(--primary) 20%, transparent)',
          background: 'linear-gradient(180deg, color-mix(in oklch, var(--card) 100%, var(--primary) 8%) 0%, var(--card) 100%)',
        }}
      >
        <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
          TURNTABLE
        </span>
        <span className="text-xs font-display text-primary font-semibold">ROCKO</span>
      </div>

      {/* Área del plato: fondo con “surcos” circulares sutiles */}
      <div
        className="relative p-6"
        style={{
          background: `
            radial-gradient(circle at 50% 30%, color-mix(in oklch, var(--background) 70%, var(--primary) 5%) 0%, transparent 55%),
            var(--card)
          `,
        }}
      >
        {/* Líneas finas tipo surco de vinilo (solo decorativas) */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.07]"
          style={{
            backgroundImage: `repeating-radial-gradient(
              circle at 50% 30%,
              transparent 0,
              transparent 8px,
              var(--foreground) 8px,
              var(--foreground) 8.5px
            )`,
            backgroundSize: '100% 100%',
          }}
        />
        <div className="relative rounded-2xl p-4 border bg-card/80" style={{ borderColor: 'color-mix(in oklch, var(--primary) 25%, transparent)' }}>
          {children}
        </div>
      </div>

      {/* Pie tipo base de tocadiscos */}
      <div
        className="h-3 border-t"
        style={{
          borderColor: 'color-mix(in oklch, var(--primary) 20%, transparent)',
          background: 'linear-gradient(180deg, var(--muted) 0%, var(--background) 100%)',
        }}
      />
    </div>
  );
}
