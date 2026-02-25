import { NextRequest, NextResponse } from 'next/server';
import { getFirstTimestampSeconds, getLastTimestampSeconds } from '@/lib/utils/lrc';

const LRCLIB_BASE = 'https://lrclib.net/api';

/** Respuesta de LRCLIB search/get */
interface LrclibRecord {
  id: number;
  trackName: string;
  artistName: string;
  albumName: string;
  duration: number;
  plainLyrics: string | null;
  syncedLyrics: string | null;
}

/**
 * Busca letras en LRCLIB (gratuito, sin API key).
 * GET /api/lyrics/search?track_name=...&artist_name=...&duration=...
 * Devuelve syncedLyrics (LRC) o plainLyrics si no hay sincronizada.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const track_name = searchParams.get('track_name')?.trim();
  const artist_name = searchParams.get('artist_name')?.trim();
  const duration = searchParams.get('duration');

  if (!track_name || !artist_name) {
    return NextResponse.json(
      { error: 'Faltan track_name o artist_name' },
      { status: 400 }
    );
  }

  const headers: HeadersInit = {
    'User-Agent': 'Rocko/1.0 (https://github.com/rocko-jukebox)',
  };

  const durationSec = duration ? parseInt(duration, 10) : null;

  // Si tenemos duración, intentar get (mejor match). album_name requerido en API.
  if (durationSec != null && durationSec > 0) {
    const getUrl = new URL(`${LRCLIB_BASE}/get`);
    getUrl.searchParams.set('track_name', track_name);
    getUrl.searchParams.set('artist_name', artist_name);
    getUrl.searchParams.set('duration', String(durationSec));

    const getRes = await fetch(getUrl.toString(), { headers });
    if (getRes.ok) {
      const data = (await getRes.json()) as LrclibRecord;
      const lyrics = data.syncedLyrics?.trim() || data.plainLyrics?.trim() || null;
      if (lyrics) {
        const lrcText = data.syncedLyrics ?? lyrics;
        const firstTs = getFirstTimestampSeconds(lrcText);
        const lastTs = getLastTimestampSeconds(lrcText);
        return NextResponse.json({
          syncedLyrics: data.syncedLyrics,
          plainLyrics: data.plainLyrics,
          lyrics,
          trackName: data.trackName,
          artistName: data.artistName,
          lrclibDuration: data.duration ?? null,
          firstTimestampSeconds: firstTs ?? null,
          lastTimestampSeconds: lastTs ?? null,
        });
      }
    }
  }

  // Fallback: búsqueda por título y artista
  const searchUrl = new URL(`${LRCLIB_BASE}/search`);
  searchUrl.searchParams.set('track_name', track_name);
  searchUrl.searchParams.set('artist_name', artist_name);

  const searchRes = await fetch(searchUrl.toString(), { headers });
  if (!searchRes.ok) {
    return NextResponse.json(
      { error: 'No se pudo buscar en LRCLIB' },
      { status: 502 }
    );
  }

  const list = (await searchRes.json()) as LrclibRecord[];
  if (!Array.isArray(list) || list.length === 0) {
    return NextResponse.json(
      { error: 'No se encontraron letras para esta canción' },
      { status: 404 }
    );
  }

  // Si tenemos duración, preferir el registro que más coincida
  let best = list[0];
  if (durationSec != null && durationSec > 0) {
    const byDuration = list.find(
      (r) => r.duration && Math.abs(r.duration - durationSec) <= 5
    );
    if (byDuration) best = byDuration;
  }

  const lyrics = best.syncedLyrics?.trim() || best.plainLyrics?.trim() || null;
  if (!lyrics) {
    return NextResponse.json(
      { error: 'No hay letra disponible para esta canción' },
      { status: 404 }
    );
  }

  const lrcText = best.syncedLyrics ?? lyrics;
  const firstTs = getFirstTimestampSeconds(lrcText);
  const lastTs = getLastTimestampSeconds(lrcText);
  return NextResponse.json({
    syncedLyrics: best.syncedLyrics,
    plainLyrics: best.plainLyrics,
    lyrics,
    trackName: best.trackName,
    artistName: best.artistName,
    lrclibDuration: best.duration ?? null,
    firstTimestampSeconds: firstTs ?? null,
    lastTimestampSeconds: lastTs ?? null,
  });
}
