'use client';

import Link from 'next/link';
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
import { useThemeStore } from '@/lib/store/themeStore';
import { THEMES, type ThemeId } from '@/lib/theme';
import { createClient } from '@/lib/supabase/client';

export function TopBar() {
  const { user } = useUserStore();
  const { connectedUsers } = useJukeboxStore();
  const { theme, setTheme } = useThemeStore();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/auth/login';
  }

  return (
    <header
      className="h-14 flex items-center justify-between px-4 md:px-6 shrink-0 bg-card border-b border-border"
      style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.4)' }}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 group">
        <div className="w-7 h-7 rounded-full flex items-center justify-center bg-primary">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--primary-foreground)">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </div>
        <span className="text-xl font-bold tracking-tight hidden sm:block font-display text-primary">
          ROCKO
        </span>
      </Link>

      {/* Centro — usuarios conectados + selector de tema */}
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="flex items-center gap-1.5">
          <div
            className="rounded-full bg-primary"
            style={{ width: 7, height: 7, boxShadow: '0 0 6px var(--primary)' }}
          />
          <span className="text-xs font-mono text-muted-foreground">
            {connectedUsers} {connectedUsers === 1 ? 'usuario' : 'usuarios'} online
          </span>
        </div>
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value as ThemeId)}
          title="Look and feel de la rockola"
          className="h-8 min-w-0 max-w-[130px] rounded-lg border border-border bg-card px-2.5 text-xs font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background appearance-none cursor-pointer bg-no-repeat pr-7"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
            backgroundPosition: 'right 0.5rem center',
          }}
        >
          {THEMES.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      {/* Derecha — créditos + user menu */}
      <div className="flex items-center gap-3">
        <CreditDisplay />

        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="focus:outline-none">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="text-xs font-bold bg-primary text-primary-foreground">
                    {user.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="bg-card border border-border">
              <div className="px-3 py-2">
                <p className="text-sm font-semibold text-foreground">{user.username}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>

              <DropdownMenuSeparator className="bg-muted" />

              {user.role === 'admin' && (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="cursor-pointer text-primary">
                      Panel de Admin
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-muted" />
                </>
              )}

              <DropdownMenuItem asChild>
                <Link href="/configuracion" className="cursor-pointer text-primary">
                  Configuración
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-muted" />

              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-accent">
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
