'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Toaster } from '@/components/ui/sonner';
import { createClient } from '@/lib/supabase/client';
import { useUserStore } from '@/lib/store/userStore';
import { useThemeStore } from '@/lib/store/themeStore';
import type { User } from '@/lib/types';
import type { AuthChangeEvent, Session, User as AuthUser } from '@supabase/supabase-js';

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { setUser } = useUserStore();
  const hydrate = useThemeStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // Reaplicar tema en cada navegación (el layout del servidor no incluye data-theme y lo sobrescribe)
  useEffect(() => {
    hydrate();
  }, [pathname, hydrate]);

  useEffect(() => {
    const supabase = createClient();

    async function loadProfile(authUser: AuthUser) {
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (profile) {
        setUser(profile as User);
      } else {
        const fromMetadata =
          (authUser.user_metadata?.username as string | undefined) ??
          (authUser.user_metadata?.full_name as string | undefined) ??
          (authUser.user_metadata?.name as string | undefined);
        const username = fromMetadata
          ? fromMetadata.replace(/\s+/g, '_').toLowerCase().slice(0, 30) || authUser.email?.split('@')[0]
          : authUser.email?.split('@')[0];
        const finalUsername = (username && username.length >= 2) ? username : 'usuario';
        const { data: newProfile } = await supabase
          .from('users')
          .insert({ id: authUser.id, email: authUser.email!, username: finalUsername, credits: 50, role: 'user' })
          .select()
          .single();
        if (newProfile) setUser(newProfile as User);
      }
    }

    // Carga inicial — getUser() es la fuente de verdad para la sesión activa
    supabase.auth.getUser().then(({ data: { user } }: { data: { user: AuthUser | null } }) => {
      if (user) loadProfile(user);
      else setUser(null);
    });

    // Escucha cambios posteriores (login, logout, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      if (event === 'SIGNED_OUT' || !session?.user) {
        setUser(null);
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        loadProfile(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser]);

  return (
    <>
      {children}
      <Toaster
        position="bottom-right"
        theme="dark"
        toastOptions={{
          style: {
            background: 'var(--card)',
            border: '1px solid var(--border)',
            color: 'var(--foreground)',
          },
        }}
      />
    </>
  );
}
