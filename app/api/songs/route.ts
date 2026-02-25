import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('q') ?? '';
  const genre = searchParams.get('genre') ?? '';

  let query = supabase
    .from('songs')
    .select('*')
    .order('plays_count', { ascending: false });

  if (search) {
    query = query.or(`title.ilike.%${search}%,artist.ilike.%${search}%`);
  }

  if (genre) {
    query = query.eq('genre', genre);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
