import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
/** Devuelve la lista de géneros distintos que existen en el catálogo (para filtros). */
/**
 * Devuelve los géneros distintos del catálogo (para filtros).
 * El cliente de Supabase/PostgREST no expone SELECT DISTINCT; la deduplicación se hace aquí.
 */
export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('songs')
    .select('genre')
    .not('genre', 'is', null);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const genres = [...new Set((data ?? []).map((r) => r.genre as string).filter(Boolean))].sort(
    (a, b) => a.localeCompare(b)
  );

  return NextResponse.json(genres);
}
