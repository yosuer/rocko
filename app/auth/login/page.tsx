'use client';

import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      toast.error(error.message);
    } else {
      window.location.href = '/';
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center wood-texture bg-background">
      <div className="jukebox-frame rounded-2xl p-8 w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1
            className="text-5xl font-bold tracking-tight"
            style={{
              fontFamily: 'var(--font-playfair)',
              background: 'linear-gradient(180deg, oklch(0.88 0.13 88) 0%, oklch(0.62 0.145 82) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: 'none',
            }}
          >
            ROCKO
          </h1>
          <p className="text-muted-foreground text-sm mt-1 font-mono">
            La rockola digital
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
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
              className="bg-input border-border/60 focus:border-primary text-foreground placeholder:text-muted-foreground"
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
              placeholder="••••••••"
              required
              className="bg-input border-border/60 focus:border-primary text-foreground"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full gold-button text-primary-foreground font-semibold border-none mt-2"
          >
            {loading ? 'Entrando...' : 'Entrar a la Rockola'}
          </Button>
        </form>

        <p className="text-center text-muted-foreground text-sm mt-6">
          ¿Sin cuenta?{' '}
          <Link href="/auth/register" className="text-primary hover:text-jukebox-gold-light transition-colors">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
