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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { supabase, error } = await checkAdmin();
  if (error) return error;
  const { id } = await params;
  const body = await request.json();
  const { data, error: dbError } = await supabase.from('songs').update(body).eq('id', id).select().single();
  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { supabase, error } = await checkAdmin();
  if (error) return error;
  const { id } = await params;
  const { error: dbError } = await supabase.from('songs').delete().eq('id', id);
  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
