import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single();
  if (!profile || profile.role !== 'admin') return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });

  const { id } = await params;
  const body = await request.json();

  // Solo se permite actualizar is_banned y role desde esta ruta
  const allowed: Record<string, unknown> = {};
  if (typeof body.is_banned === 'boolean') allowed.is_banned = body.is_banned;
  if (body.role === 'user' || body.role === 'admin') allowed.role = body.role;

  const { data, error } = await supabase.from('users').update(allowed).eq('id', id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
