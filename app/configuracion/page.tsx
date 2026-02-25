import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { AppearanceSection } from '@/components/config/AppearanceSection';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function ConfiguracionPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/auth/login');

  const { data: profile } = await supabase
    .from('users')
    .select('is_banned')
    .eq('id', user.id)
    .single();

  if (profile?.is_banned) redirect('/auth/login');

  return (
    <div className="min-h-screen flex flex-col">
      <header className="h-14 flex items-center justify-between px-4 md:px-6 border-b border-border bg-card shrink-0">
        <Link href="/" className="text-primary font-semibold hover:underline">
          ← Volver a la rockola
        </Link>
      </header>
      <main className="flex-1 p-4 md:p-6 max-w-2xl mx-auto w-full">
        <h1 className="text-2xl font-display font-bold text-foreground mb-2">Configuración</h1>
        <p className="text-muted-foreground text-sm mb-8">
          Ajustes de tu cuenta y de la aplicación.
        </p>
        <AppearanceSection />
      </main>
    </div>
  );
}
