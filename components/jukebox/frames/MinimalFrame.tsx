'use client';

/** Reproductor minimal: tarjeta limpia, bordes sutiles, sin decoración */
export function MinimalFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="w-full max-w-sm mx-auto rounded-2xl bg-card border border-border overflow-hidden"
      style={{
        minWidth: 280,
        boxShadow: '0 4px 24px rgba(0,0,0,0.12), 0 1px 3px rgba(0,0,0,0.08)',
      }}
    >
      <div className="px-4 py-2 border-b border-border flex items-center justify-between">
        <span className="text-xs font-mono text-muted-foreground tracking-wider">ROCKO</span>
        <span className="w-2 h-2 rounded-full bg-primary" title="Reproductor" />
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}
