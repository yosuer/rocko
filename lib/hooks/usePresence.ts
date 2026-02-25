'use client';

import { useEffect } from 'react';
import type { REALTIME_SUBSCRIBE_STATES } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { useJukeboxStore } from '@/lib/store/jukeboxStore';
import { useUserStore } from '@/lib/store/userStore';

export function usePresence() {
  const { setConnectedUsers } = useJukeboxStore();
  const { user } = useUserStore();

  useEffect(() => {
    if (!user) return;

    const supabase = createClient();
    const channel = supabase.channel('jukebox-presence', {
      config: { presence: { key: user.id } },
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        setConnectedUsers(Object.keys(state).length);
      })
      .subscribe(async (status: REALTIME_SUBSCRIBE_STATES) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            user_id: user.id,
            username: user.username,
            online_at: new Date().toISOString(),
          });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, setConnectedUsers]);
}
