'use client';

import Link from 'next/link';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { CreditDisplay } from '@/components/credits/CreditDisplay';
import { useUserStore } from '@/lib/store/userStore';
import { useJukeboxStore } from '@/lib/store/jukeboxStore';
import { createClient } from '@/lib/supabase/client';

export function TopBar() {
  const { user } = useUserStore();
  const { connectedUsers } = useJukeboxStore();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/auth/login';
  }

  return (
    <header
      className="h-14 flex items-center justify-between px-4 md:px-6 shrink-0"
      style={{
        background: 'oklch(0.14 0.025 42)',
        borderBottom: '1px solid oklch(0.71 0.145 85 / 0.25)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
      }}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 group">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center"
          style={{ background: 'oklch(0.71 0.145 85)' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="oklch(0.12 0.022 42)">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </div>
        <span
          className="text-xl font-bold tracking-tight hidden sm:block"
          style={{
            fontFamily: 'var(--font-playfair)',
            background: 'linear-gradient(180deg, oklch(0.88 0.13 88) 0%, oklch(0.62 0.145 82) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          ROCKO
        </span>
      </Link>

      {/* Centro — usuarios conectados */}
      <div className="flex items-center gap-1.5">
        <div
          className="rounded-full"
          style={{ width: 7, height: 7, background: 'oklch(0.68 0.16 145)', boxShadow: '0 0 6px oklch(0.68 0.16 145)' }}
        />
        <span className="text-xs font-mono" style={{ color: 'oklch(0.60 0.025 60)' }}>
          {connectedUsers} {connectedUsers === 1 ? 'usuario' : 'usuarios'} online
        </span>
      </div>

      {/* Derecha — créditos + user menu */}
      <div className="flex items-center gap-3">
        <CreditDisplay />

        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="focus:outline-none">
                <Avatar className="w-8 h-8">
                  <AvatarFallback
                    className="text-xs font-bold"
                    style={{
                      background: 'oklch(0.71 0.145 85)',
                      color: 'oklch(0.12 0.022 42)',
                    }}
                  >
                    {user.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              style={{
                background: 'oklch(0.18 0.028 42)',
                border: '1px solid oklch(0.71 0.145 85 / 0.25)',
              }}
            >
              <div className="px-3 py-2">
                <p className="text-sm font-semibold" style={{ color: 'oklch(0.90 0.025 80)' }}>
                  {user.username}
                </p>
                <p className="text-xs" style={{ color: 'oklch(0.55 0.025 60)' }}>
                  {user.email}
                </p>
              </div>

              <DropdownMenuSeparator style={{ background: 'oklch(0.28 0.025 42)' }} />

              {user.role === 'admin' && (
                <>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/admin"
                      className="cursor-pointer"
                      style={{ color: 'oklch(0.82 0.13 88)' }}
                    >
                      Panel de Admin
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator style={{ background: 'oklch(0.28 0.025 42)' }} />
                </>
              )}

              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer"
                style={{ color: 'oklch(0.65 0.175 25)' }}
              >
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
