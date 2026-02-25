'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/admin',        label: 'Dashboard',  icon: '📊' },
  { href: '/admin/songs',  label: 'Canciones',  icon: '🎵' },
  { href: '/admin/users',  label: 'Usuarios',   icon: '👥' },
  { href: '/',             label: '← Rockola',  icon: '🎶' },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="w-56 flex flex-col shrink-0 h-full"
      style={{
        background: 'oklch(0.14 0.025 42)',
        borderRight: '1px solid oklch(0.71 0.145 85 / 0.2)',
      }}
    >
      {/* Header */}
      <div
        className="px-5 py-4"
        style={{ borderBottom: '1px solid oklch(0.25 0.025 42)' }}
      >
        <h1
          className="text-lg font-bold"
          style={{
            fontFamily: 'var(--font-playfair)',
            background: 'linear-gradient(180deg, oklch(0.88 0.13 88) 0%, oklch(0.62 0.145 82) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          ROCKO Admin
        </h1>
        <p className="text-xs font-mono mt-0.5" style={{ color: 'oklch(0.50 0.025 60)' }}>
          Panel de control
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href !== '/' &&
            (item.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all"
              style={{
                background: isActive ? 'oklch(0.71 0.145 85 / 0.15)' : 'transparent',
                color: isActive ? 'oklch(0.82 0.13 88)' : 'oklch(0.65 0.025 60)',
                borderLeft: isActive ? '2px solid oklch(0.71 0.145 85)' : '2px solid transparent',
              }}
            >
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
