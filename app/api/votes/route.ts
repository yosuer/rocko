import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { SKIP_THRESHOLD } from '@/lib/types';
import type { VoteType } from '@/lib/types';

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const body = await request.json();
  const { queue_id, vote_type } = body as { queue_id: string; vote_type: VoteType };

  if (!queue_id || !vote_type) {
    return NextResponse.json({ error: 'Parámetros requeridos' }, { status: 400 });
  }

  // Verificar que el item existe y está activo
  const { data: queueItem } = await supabase
    .from('queue')
    .select('id, status, votes_skip, votes_up')
    .eq('id', queue_id)
    .in('status', ['pending', 'playing'])
    .single();

  if (!queueItem) {
    return NextResponse.json({ error: 'Item de cola no encontrado' }, { status: 404 });
  }

  // Verificar si el usuario ya votó
  const { data: existingVote } = await supabase
    .from('votes')
    .select('id')
    .eq('user_id', user.id)
    .eq('queue_id', queue_id)
    .eq('vote_type', vote_type)
    .single();

  if (existingVote) {
    // Quitar el voto (toggle)
    await supabase.from('votes').delete().eq('id', existingVote.id);

    const field = vote_type === 'skip' ? 'votes_skip' : 'votes_up';
    const current = vote_type === 'skip' ? queueItem.votes_skip : queueItem.votes_up;
    await supabase
      .from('queue')
      .update({ [field]: Math.max(0, current - 1) })
      .eq('id', queue_id);

    return NextResponse.json({ action: 'removed', vote_type });
  }

  // Agregar voto
  await supabase.from('votes').insert({ user_id: user.id, queue_id, vote_type });

  const field = vote_type === 'skip' ? 'votes_skip' : 'votes_up';
  const current = vote_type === 'skip' ? queueItem.votes_skip : queueItem.votes_up;
  const newCount = current + 1;

  await supabase
    .from('queue')
    .update({ [field]: newCount })
    .eq('id', queue_id);

  // Si es skip, verificar umbral
  if (vote_type === 'skip' && queueItem.status === 'playing') {
    // Contamos usuarios conectados (simplificado: contamos votos únicos activos)
    // El threshold real se maneja en el cliente con Presence
    // Aquí retornamos el nuevo conteo para que el cliente decida
    return NextResponse.json({
      action: 'added',
      vote_type,
      votes_skip: newCount,
      threshold: SKIP_THRESHOLD,
    });
  }

  // Si es upvote, reordenar la cola
  if (vote_type === 'up') {
    await supabase.rpc('reorder_queue_by_votes');
  }

  return NextResponse.json({ action: 'added', vote_type });
}
