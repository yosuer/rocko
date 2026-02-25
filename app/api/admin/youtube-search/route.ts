import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getThumbnailUrl, parseYouTubeDuration } from '@/lib/utils/youtube';

export type YouTubeSearchItem = {
  videoId: string;
  title: string;
  channelTitle: string;
  thumbnail: string;
  duration: number | null;
};

async function checkAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: NextResponse.json({ error: 'No autorizado' }, { status: 401 }) };
  const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single();
  if (!profile || profile.role !== 'admin') return { error: NextResponse.json({ error: 'Acceso denegado' }, { status: 403 }) };
  return { error: null };
}

export async function GET(request: NextRequest) {
  const { error: authError } = await checkAdmin();
  if (authError) return authError;

  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'YOUTUBE_API_KEY no configurada. Añádela en .env.local.' },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.trim();
  if (!q) {
    return NextResponse.json({ error: 'Falta el parámetro q' }, { status: 400 });
  }

  try {
    const searchUrl = new URL('https://www.googleapis.com/youtube/v3/search');
    searchUrl.searchParams.set('part', 'snippet');
    searchUrl.searchParams.set('type', 'video');
    searchUrl.searchParams.set('maxResults', '15');
    searchUrl.searchParams.set('q', q);
    searchUrl.searchParams.set('key', apiKey);

    const searchRes = await fetch(searchUrl.toString());
    if (!searchRes.ok) {
      const err = await searchRes.text();
      console.error('YouTube search error:', searchRes.status, err);
      return NextResponse.json(
        { error: 'Error al buscar en YouTube' },
        { status: 502 }
      );
    }

    const searchData = (await searchRes.json()) as {
      items?: Array<{
        id?: { videoId?: string };
        snippet?: { title?: string; channelTitle?: string; thumbnails?: { medium?: { url?: string }; default?: { url?: string } } };
      }>;
    };

    const items = searchData.items ?? [];
    const videoIds = items
      .map((i) => i.id?.videoId)
      .filter((id): id is string => !!id);

    if (videoIds.length === 0) {
      return NextResponse.json({ items: [] });
    }

    const videosUrl = new URL('https://www.googleapis.com/youtube/v3/videos');
    videosUrl.searchParams.set('part', 'contentDetails');
    videosUrl.searchParams.set('id', videoIds.join(','));
    videosUrl.searchParams.set('key', apiKey);

    const videosRes = await fetch(videosUrl.toString());
    const durationsById: Record<string, number | null> = {};
    if (videosRes.ok) {
      const videosData = (await videosRes.json()) as {
        items?: Array<{ id?: string; contentDetails?: { duration?: string } }>;
      };
      for (const v of videosData.items ?? []) {
        const id = v.id;
        const dur = v.contentDetails?.duration;
        durationsById[id ?? ''] = dur ? parseYouTubeDuration(dur) : null;
      }
    }

    const result: YouTubeSearchItem[] = items.map((i) => {
      const videoId = i.id?.videoId ?? '';
      const thumb = i.snippet?.thumbnails?.medium?.url ?? i.snippet?.thumbnails?.default?.url;
      return {
        videoId,
        title: i.snippet?.title ?? '',
        channelTitle: i.snippet?.channelTitle ?? '',
        thumbnail: thumb ?? getThumbnailUrl(videoId),
        duration: durationsById[videoId] ?? null,
      };
    });

    return NextResponse.json({ items: result });
  } catch (err) {
    console.error('YouTube search:', err);
    return NextResponse.json({ error: 'Error al buscar en YouTube' }, { status: 502 });
  }
}
