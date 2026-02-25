import { createClient } from '@/lib/supabase/server';

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [
    { count: totalSongs },
    { count: totalUsers },
    { data: topSongs },
    { data: recentTx },
  ] = await Promise.all([
    supabase.from('songs').select('*', { count: 'exact', head: true }),
    supabase.from('users').select('*', { count: 'exact', head: true }),
    supabase
      .from('songs')
      .select('id, title, artist, plays_count')
      .order('plays_count', { ascending: false })
      .limit(5),
    supabase
      .from('transactions')
      .select('id, amount, type, description, created_at, users(username)')
      .order('created_at', { ascending: false })
      .limit(10),
  ]);

  const cards = [
    { label: 'Canciones', value: totalSongs ?? 0, icon: '🎵', color: 'oklch(0.71 0.145 85)' },
    { label: 'Usuarios',  value: totalUsers ?? 0,  icon: '👥', color: 'oklch(0.68 0.16 145)' },
  ];

  return (
    <div className="p-6 space-y-8 max-w-5xl">
      <div>
        <h1
          className="text-3xl font-bold"
          style={{ fontFamily: 'var(--font-playfair)', color: 'oklch(0.82 0.13 88)' }}
        >
          Dashboard
        </h1>
        <p className="text-sm mt-1" style={{ color: 'oklch(0.55 0.025 60)' }}>
          Resumen general de Rocko
        </p>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div
            key={c.label}
            className="rounded-xl p-4"
            style={{
              background: 'oklch(0.16 0.028 42)',
              border: '1px solid oklch(0.28 0.025 42)',
            }}
          >
            <div className="text-2xl mb-1">{c.icon}</div>
            <div
              className="text-3xl font-bold font-mono tabular-nums"
              style={{ color: c.color }}
            >
              {c.value}
            </div>
            <div className="text-xs mt-0.5" style={{ color: 'oklch(0.55 0.025 60)' }}>
              {c.label}
            </div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Top canciones */}
        <div
          className="rounded-xl overflow-hidden"
          style={{
            background: 'oklch(0.16 0.028 42)',
            border: '1px solid oklch(0.28 0.025 42)',
          }}
        >
          <div
            className="px-4 py-3"
            style={{ borderBottom: '1px solid oklch(0.25 0.025 42)' }}
          >
            <h2 className="text-sm font-semibold" style={{ color: 'oklch(0.82 0.13 88)' }}>
              Top canciones más pedidas
            </h2>
          </div>
          <div className="p-2 space-y-1">
            {(topSongs ?? []).map((song, i) => (
              <div key={song.id} className="flex items-center gap-3 px-2 py-1.5">
                <span
                  className="text-xs font-mono w-4 text-right"
                  style={{ color: 'oklch(0.71 0.145 85)' }}
                >
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate" style={{ color: 'oklch(0.88 0.025 80)' }}>
                    {song.title}
                  </p>
                  <p className="text-xs" style={{ color: 'oklch(0.55 0.025 60)' }}>
                    {song.artist}
                  </p>
                </div>
                <span
                  className="text-xs font-mono"
                  style={{ color: 'oklch(0.60 0.08 80)' }}
                >
                  {song.plays_count} plays
                </span>
              </div>
            ))}
            {(!topSongs || topSongs.length === 0) && (
              <p className="text-sm text-center py-4" style={{ color: 'oklch(0.50 0.025 60)' }}>
                Sin datos aún
              </p>
            )}
          </div>
        </div>

        {/* Transacciones recientes */}
        <div
          className="rounded-xl overflow-hidden"
          style={{
            background: 'oklch(0.16 0.028 42)',
            border: '1px solid oklch(0.28 0.025 42)',
          }}
        >
          <div
            className="px-4 py-3"
            style={{ borderBottom: '1px solid oklch(0.25 0.025 42)' }}
          >
            <h2 className="text-sm font-semibold" style={{ color: 'oklch(0.82 0.13 88)' }}>
              Transacciones recientes
            </h2>
          </div>
          <div className="p-2 space-y-1">
            {(recentTx ?? []).map((tx) => (
              <div key={tx.id} className="flex items-center justify-between px-2 py-1.5">
                <div className="min-w-0">
                  <p className="text-xs truncate" style={{ color: 'oklch(0.80 0.025 80)' }}>
                    {/* @ts-expect-error joined relation */}
                    {tx.users?.username ?? 'Usuario'} — {tx.description}
                  </p>
                </div>
                <span
                  className="text-xs font-mono ml-2 shrink-0"
                  style={{ color: tx.amount > 0 ? 'oklch(0.68 0.16 145)' : 'oklch(0.58 0.175 25)' }}
                >
                  {tx.amount > 0 ? '+' : ''}{tx.amount}
                </span>
              </div>
            ))}
            {(!recentTx || recentTx.length === 0) && (
              <p className="text-sm text-center py-4" style={{ color: 'oklch(0.50 0.025 60)' }}>
                Sin transacciones aún
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
