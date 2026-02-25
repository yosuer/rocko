-- Letras en formato LRC para sincronización con la reproducción
ALTER TABLE public.songs
ADD COLUMN IF NOT EXISTS lyrics TEXT;

COMMENT ON COLUMN public.songs.lyrics IS 'Letra en formato LRC: [mm:ss.xx] línea de texto. Ej: [00:12.50] Hello world';
