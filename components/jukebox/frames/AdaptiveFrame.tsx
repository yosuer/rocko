'use client';

import type { ThemeId } from '@/lib/theme';
import { cn } from '@/lib/utils';

interface AdaptiveFrameProps {
  theme: ThemeId;
  children: React.ReactNode;
}

/**
 * Un solo marco que cambia de aspecto según el tema.
 * El nodo que envuelve {children} es siempre el mismo, así NowPlaying no se desmonta
 * y la canción no se reinicia al cambiar de tema.
 */
export function AdaptiveFrame({ theme, children }: AdaptiveFrameProps) {
  const isNeon = theme === 'neon';
  const isClassic = theme === 'classic';
  const isMinimal = theme === 'minimal';
  const isVinyl = theme === 'vinyl';

  return (
    <div
      className={cn(
        'w-full max-w-xl mx-auto',
        isClassic && 'jukebox-frame rounded-3xl p-1',
        isNeon && 'rounded-2xl overflow-hidden border-2 border-primary/60 bg-card',
        isMinimal && 'rounded-2xl bg-card border border-border overflow-hidden',
        isVinyl && 'rounded-3xl overflow-hidden border-2 bg-card'
      )}
      style={{
        minWidth: 360,
        ...(isNeon && {
          boxShadow: '0 0 24px color-mix(in oklch, var(--primary) 30%, transparent), 0 0 48px color-mix(in oklch, var(--accent) 15%, transparent), inset 0 0 60px rgba(0,0,0,0.5)',
        }),
        ...(isMinimal && {
          boxShadow: '0 4px 24px rgba(0,0,0,0.12), 0 1px 3px rgba(0,0,0,0.08)',
        }),
        ...(isVinyl && {
          borderColor: 'color-mix(in oklch, var(--primary) 35%, var(--border))',
          boxShadow: '0 8px 32px rgba(0,0,0,0.25), 0 0 0 1px color-mix(in oklch, var(--primary) 15%, transparent) inset',
        }),
      }}
    >
      {/* Header — contenido según tema */}
      {isClassic && (
        <div className="metal-panel rounded-t-2xl px-4 py-2 flex items-center justify-between border-b border-border/50">
          <div className="flex items-center gap-2">
            {['var(--accent)', 'var(--primary)', 'var(--secondary)'].map((color, i) => (
              <div key={i} className="rounded-full" style={{ width: 8, height: 8, background: color, boxShadow: `0 0 6px ${color}` }} />
            ))}
          </div>
          <span className="text-xs font-mono tracking-widest uppercase text-muted-foreground">ROCKO v1.0</span>
          <div className="flex items-center gap-2">
            {['var(--secondary)', 'var(--primary)', 'var(--accent)'].map((color, i) => (
              <div key={i} className="rounded-full" style={{ width: 8, height: 8, background: color, boxShadow: `0 0 6px ${color}` }} />
            ))}
          </div>
        </div>
      )}
      {isNeon && (
        <div
          className="h-8 flex items-center justify-center gap-2 border-b border-primary/40"
          style={{
            background: 'linear-gradient(180deg, color-mix(in oklch, var(--primary) 12%, transparent) 0%, transparent 100%)',
            boxShadow: '0 0 12px var(--primary)',
          }}
        >
          <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-primary/90">ROCKO FM</span>
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" style={{ boxShadow: '0 0 6px var(--primary)' }} />
        </div>
      )}
      {isMinimal && (
        <div className="px-4 py-2 border-b border-border flex items-center justify-between">
          <span className="text-xs font-mono text-muted-foreground tracking-wider">ROCKO</span>
          <span className="w-2 h-2 rounded-full bg-primary" title="Reproductor" />
        </div>
      )}
      {isVinyl && (
        <div
          className="px-4 py-2.5 flex items-center justify-between border-b"
          style={{
            borderColor: 'color-mix(in oklch, var(--primary) 20%, transparent)',
            background: 'linear-gradient(180deg, color-mix(in oklch, var(--card) 100%, var(--primary) 8%) 0%, var(--card) 100%)',
          }}
        >
          <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">TURNTABLE</span>
          <span className="text-xs font-display text-primary font-semibold">ROCKO</span>
        </div>
      )}

      {/* Cuerpo: mismo nodo estable para children; paneles laterales solo en neon */}
      <div className={cn('flex', isNeon && 'min-h-[380px]')}>
        {isNeon && (
          <div
            className="w-12 shrink-0 flex flex-col items-center justify-center gap-1 py-4 border-r border-primary/30"
            style={{
              background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, color-mix(in oklch, var(--primary) 8%, transparent) 3px, color-mix(in oklch, var(--primary) 8%, transparent) 4px)',
              boxShadow: 'inset 0 0 20px rgba(0,0,0,0.6)',
            }}
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="w-6 h-0.5 rounded-full opacity-60" style={{ background: 'var(--primary)', boxShadow: '0 0 4px var(--primary)' }} />
            ))}
          </div>
        )}

        <div
          className={cn(
            'flex-1 flex flex-col min-w-0',
            isClassic && 'rounded-b-2xl p-5 wood-texture bg-background/95 border-t border-border/30',
            isNeon && 'justify-center p-4',
            isMinimal && 'p-6',
            isVinyl && 'relative p-6'
          )}
          style={
            isVinyl
              ? {
                  background: 'radial-gradient(circle at 50% 30%, color-mix(in oklch, var(--background) 70%, var(--primary) 5%) 0%, transparent 55%), var(--card)',
                }
              : undefined
          }
        >
          {isVinyl && (
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.07]"
              style={{
                backgroundImage: 'repeating-radial-gradient(circle at 50% 30%, transparent 0, transparent 8px, var(--foreground) 8px, var(--foreground) 8.5px)',
                backgroundSize: '100% 100%',
              }}
            />
          )}
          <div
            className={cn(
              'relative',
              isClassic && 'rounded-xl p-4 neon-gold bg-card border border-border',
              isNeon && 'rounded-xl p-4 border border-primary/50 w-full',
              isVinyl && 'rounded-2xl p-4 border bg-card/80'
            )}
            style={{
              ...(isNeon && {
                background: 'color-mix(in oklch, var(--background) 90%, var(--primary) 5%)',
                boxShadow: '0 0 16px color-mix(in oklch, var(--primary) 25%, transparent), inset 0 0 20px rgba(0,0,0,0.4)',
              }),
              ...(isVinyl && { borderColor: 'color-mix(in oklch, var(--primary) 25%, transparent)' }),
            }}
          >
            {children}
          </div>
          {isClassic && (
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
          )}
        </div>

        {isNeon && (
          <div
            className="w-12 shrink-0 flex flex-col items-center justify-center gap-1 py-4 border-l border-primary/30"
            style={{
              background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, color-mix(in oklch, var(--accent) 8%, transparent) 3px, color-mix(in oklch, var(--accent) 8%, transparent) 4px)',
              boxShadow: 'inset 0 0 20px rgba(0,0,0,0.6)',
            }}
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="w-6 h-0.5 rounded-full opacity-60" style={{ background: 'var(--accent)', boxShadow: '0 0 4px var(--accent)' }} />
            ))}
          </div>
        )}
      </div>

      {/* Footer solo neon y vinyl */}
      {isNeon && (
        <div
          className="h-2 border-t border-primary/40"
          style={{ background: 'linear-gradient(90deg, transparent, color-mix(in oklch, var(--primary) 15%, transparent) 50%, transparent)' }}
        />
      )}
      {isVinyl && (
        <div
          className="h-3 border-t"
          style={{
            borderColor: 'color-mix(in oklch, var(--primary) 20%, transparent)',
            background: 'linear-gradient(180deg, var(--muted) 0%, var(--background) 100%)',
          }}
        />
      )}
    </div>
  );
}
