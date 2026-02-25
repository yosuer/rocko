-- Desplazamiento en segundos para sincronizar letra con el vídeo.
-- Positivo = retrasar la letra (si se adelanta), negativo = adelantarla.
ALTER TABLE public.songs
ADD COLUMN IF NOT EXISTS lyrics_offset INTEGER NOT NULL DEFAULT 0;
