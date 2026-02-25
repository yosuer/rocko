import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { JukeboxClient } from '@/components/jukebox/JukeboxClient';

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/auth/login');

  const { data: profile } = await supabase
    .from('users')
    .select('role, is_banned')
    .eq('id', user.id)
    .single();

  if (profile?.is_banned) redirect('/auth/login');

  const isAdmin = profile?.role === 'admin';

  return <JukeboxClient isAdmin={isAdmin} />;
}
