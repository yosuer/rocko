/**
 * Parsea letras en formato LRC.
 * Formato: [mm:ss.xx] o [mm:ss] seguido del texto de la línea.
 * Una línea puede tener varios timestamps (se repite el texto para cada uno).
 */
export interface LrcLine {
  time: number; // segundos
  text: string;
}

const LRC_LINE_REGEX = /\[(\d{1,2}):(\d{2})(?:\.(\d{2,3}))?\]/g;

function parseTimestamp(min: string, sec: string, frac?: string): number {
  const m = parseInt(min, 10);
  const s = parseInt(sec, 10);
  const f = frac ? parseInt(frac.padEnd(3, '0').slice(0, 3), 10) / 1000 : 0;
  return m * 60 + s + f;
}

export function parseLrc(lrc: string | null | undefined): LrcLine[] {
  if (!lrc || typeof lrc !== 'string') return [];

  const lines = lrc.trim().split(/\r?\n/);
  const result: LrcLine[] = [];

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;

    let match: RegExpExecArray | null;
    LRC_LINE_REGEX.lastIndex = 0;
    const timestamps: number[] = [];
    let text = line;

    while ((match = LRC_LINE_REGEX.exec(line)) !== null) {
      timestamps.push(parseTimestamp(match[1], match[2], match[3]));
    }
    // Texto: todo lo que queda después del último ]
    const lastBracket = line.lastIndexOf(']');
    if (lastBracket !== -1) {
      text = line.slice(lastBracket + 1).trim();
    }
    if (!timestamps.length) continue;
    for (const time of timestamps) {
      result.push({ time, text });
    }
  }

  result.sort((a, b) => a.time - b.time);
  return result;
}

/** Devuelve el primer timestamp en segundos del LRC (útil para sugerir offset). */
export function getFirstTimestampSeconds(lrc: string | null | undefined): number | null {
  const lines = parseLrc(lrc);
  return lines.length > 0 ? lines[0].time : null;
}

/** Devuelve el último timestamp en segundos del LRC (duración de la canción en el LRC). Líneas como [03:51.78] sin texto cuentan. */
export function getLastTimestampSeconds(lrc: string | null | undefined): number | null {
  const lines = parseLrc(lrc);
  return lines.length > 0 ? lines[lines.length - 1].time : null;
}
