'use client';

import { useEffect } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { createClient } from '@/lib/supabase/client';
import { useUserStore } from '@/lib/store/userStore';
import type { User } from '@/lib/types';

export function Providers({ children }: { children: React.ReactNode }) {
  const { setUser } = useUserStore();

  useEffect(() => {
    const supabase = createClient();

    async function loadProfile(authUser: { id: string; email?: string; user_metadata?: Record<string, unknown> }) {
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (profile) {
        setUser(profile as User);
      } else {
        const username =
          (authUser.user_metadata?.username as string | undefined) ??
          authUser.email?.split('@')[0] ??
          'usuario';
        const { data: newProfile } = await supabase
          .from('users')
          .insert({ id: authUser.id, email: authUser.email!, username, credits: 50, role: 'user' })
          .select()
          .single();
        if (newProfile) setUser(newProfile as User);
      }
    }

    // Carga inicial — getUser() es la fuente de verdad para la sesión activa
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) loadProfile(user);
      else setUser(null);
    });

    // Escucha cambios posteriores (login, logout, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
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
            background: 'oklch(0.16 0.028 42)',
            border: '1px solid oklch(0.71 0.145 85 / 0.4)',
            color: 'oklch(0.93 0.030 80)',
          },
        }}
      />
    </>
  );
}
