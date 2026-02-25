import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/auth/login');

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role !== 'admin') redirect('/');

  return (
    <div className="flex h-screen overflow-hidden wood-texture">
      <AdminSidebar />
      <main
        className="flex-1 overflow-y-auto"
        style={{ background: 'oklch(0.10 0.018 40 / 0.7)' }}
      >
        {children}
      </main>
    </div>
  );
}
