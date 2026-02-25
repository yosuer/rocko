import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

async function checkAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { supabase, error: NextResponse.json({ error: 'No autorizado' }, { status: 401 }) };
  const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single();
  if (!profile || profile.role !== 'admin') return { supabase, error: NextResponse.json({ error: 'Acceso denegado' }, { status: 403 }) };
  return { supabase, error: null };
}

export async function POST(request: NextRequest) {
  const { supabase, error } = await checkAdmin();
  if (error) return error;

  const body = await request.json();
  const { data, error: dbError } = await supabase.from('songs').insert(body).select().single();
  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
