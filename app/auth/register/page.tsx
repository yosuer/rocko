'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (username.length < 3) {
      toast.error('El username debe tener al menos 3 caracteres.');
      return;
    }
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username } },
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('¡Bienvenido a Rocko! Revisa tu email para confirmar.');
      router.push('/auth/login');
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center wood-texture bg-background">
      <div className="jukebox-frame rounded-2xl p-8 w-full max-w-sm">
        <div className="text-center mb-8">
          <h1
            className="text-5xl font-bold tracking-tight"
            style={{
              fontFamily: 'var(--font-playfair)',
              background: 'linear-gradient(180deg, oklch(0.88 0.13 88) 0%, oklch(0.62 0.145 82) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            ROCKO
          </h1>
          <p className="text-muted-foreground text-sm mt-1 font-mono">Crea tu cuenta — 50 créditos gratis</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="username" className="text-foreground/80 text-xs uppercase tracking-wider font-mono">
              Username
            </Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="tu_nombre"
              required
              minLength={3}
              maxLength={20}
              className="bg-input border-border/60 focus:border-primary text-foreground"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-foreground/80 text-xs uppercase tracking-wider font-mono">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              className="bg-input border-border/60 focus:border-primary text-foreground"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-foreground/80 text-xs uppercase tracking-wider font-mono">
              Contraseña
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="mín. 8 caracteres"
              required
              minLength={8}
              className="bg-input border-border/60 focus:border-primary text-foreground"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full gold-button text-primary-foreground font-semibold border-none mt-2"
          >
            {loading ? 'Creando cuenta...' : 'Crear cuenta gratis'}
          </Button>
        </form>

        <p className="text-center text-muted-foreground text-sm mt-6">
          ¿Ya tienes cuenta?{' '}
          <Link href="/auth/login" className="text-primary hover:underline transition-colors">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
