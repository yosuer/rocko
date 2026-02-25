import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { QUEUE_COST } from '@/lib/types';

export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('queue')
    .select(`
      *,
      song:songs(*),
      requester:users!queue_requested_by_fkey(id, username)
    `)
    .in('status', ['pending', 'playing'])
    .order('status', { ascending: false }) // 'playing' antes de 'pending'
    .order('position', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const body = await request.json();
  const { song_id } = body as { song_id: string };

  if (!song_id) {
    return NextResponse.json({ error: 'song_id requerido' }, { status: 400 });
  }

  // Verificar que la canción existe
  const { data: song } = await supabase
    .from('songs')
    .select('id, title, artist')
    .eq('id', song_id)
    .single();

  if (!song) {
    return NextResponse.json({ error: 'Canción no encontrada' }, { status: 404 });
  }

  // Gastar créditos (operación atómica via función SQL)
  const { data: ok, error: creditError } = await supabase.rpc('spend_credits', {
    p_user_id: user.id,
    p_amount: QUEUE_COST,
    p_description: `Cola: ${song.title} — ${song.artist}`,
  });

  if (creditError || !ok) {
    return NextResponse.json(
      { error: 'Créditos insuficientes. Necesitas al menos 5 créditos.' },
      { status: 402 }
    );
  }

  // Obtener siguiente posición
  const { data: posData } = await supabase.rpc('get_next_queue_position');
  const position = posData ?? 1;

  // Insertar en la cola
  const { data: queueItem, error: queueError } = await supabase
    .from('queue')
    .insert({
      song_id,
      requested_by: user.id,
      position,
      status: 'pending',
    })
    .select(`
      *,
      song:songs(*),
      requester:users!queue_requested_by_fkey(id, username)
    `)
    .single();

  if (queueError) {
    return NextResponse.json({ error: queueError.message }, { status: 500 });
  }

  // Auto-arrancar la cola si no hay ninguna canción reproduciéndose
  const { data: playingSong } = await supabase
    .from('queue')
    .select('id')
    .eq('status', 'playing')
    .maybeSingle();

  if (!playingSong) {
    await supabase.rpc('advance_queue');
  }

  return NextResponse.json(queueItem, { status: 201 });
}
