-- ============================================================
-- ROCKO JUKEBOX - Schema SQL
-- Ejecutar en: Supabase SQL Editor
-- ============================================================

-- Extensiones
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLAS
-- ============================================================

-- Tabla de usuarios (extiende auth.users)
CREATE TABLE public.users (
  id          UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email       TEXT NOT NULL,
  username    TEXT UNIQUE NOT NULL,
  credits     INTEGER DEFAULT 50 NOT NULL CHECK (credits >= 0),
  role        TEXT DEFAULT 'user' NOT NULL CHECK (role IN ('user', 'admin')),
  is_banned   BOOLEAN DEFAULT FALSE NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Catálogo de canciones
CREATE TABLE public.songs (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title       TEXT NOT NULL,
  artist      TEXT NOT NULL,
  youtube_url TEXT NOT NULL,
  youtube_id  TEXT NOT NULL UNIQUE,
  thumbnail   TEXT,
  duration    INTEGER, -- segundos
  genre       TEXT,
  plays_count INTEGER DEFAULT 0 NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_by  UUID REFERENCES public.users(id) ON DELETE SET NULL
);

-- Cola de reproducción
CREATE TABLE public.queue (
  id           UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  song_id      UUID REFERENCES public.songs(id) ON DELETE CASCADE NOT NULL,
  requested_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  position     INTEGER NOT NULL,
  votes_skip   INTEGER DEFAULT 0 NOT NULL,
  votes_up     INTEGER DEFAULT 0 NOT NULL,
  status       TEXT DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'playing', 'played', 'skipped')),
  created_at   TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Historial de transacciones de créditos
CREATE TABLE public.transactions (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id     UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  amount      INTEGER NOT NULL,
  type        TEXT NOT NULL CHECK (type IN ('purchase', 'spend', 'admin_credit', 'refund')),
  description TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Votos de usuarios en canciones de la cola
CREATE TABLE public.votes (
  id         UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id    UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  queue_id   UUID REFERENCES public.queue(id) ON DELETE CASCADE NOT NULL,
  vote_type  TEXT NOT NULL CHECK (vote_type IN ('skip', 'up')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, queue_id, vote_type)
);

-- ============================================================
-- ÍNDICES
-- ============================================================

CREATE INDEX idx_queue_status   ON public.queue(status);
CREATE INDEX idx_queue_position ON public.queue(position) WHERE status = 'pending';
CREATE INDEX idx_votes_queue    ON public.votes(queue_id);
CREATE INDEX idx_votes_user     ON public.votes(user_id);
CREATE INDEX idx_tx_user        ON public.transactions(user_id);
CREATE INDEX idx_songs_youtube  ON public.songs(youtube_id);

-- ============================================================
-- FUNCIONES
-- ============================================================

-- Trigger: crear perfil al registrar usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, username, credits, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    50,
    'user'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Función: gastar créditos (atómica)
CREATE OR REPLACE FUNCTION public.spend_credits(
  p_user_id    UUID,
  p_amount     INTEGER,
  p_description TEXT DEFAULT 'Canción agregada a la cola'
)
RETURNS BOOLEAN AS $$
DECLARE
  v_current_credits INTEGER;
BEGIN
  SELECT credits INTO v_current_credits
  FROM public.users
  WHERE id = p_user_id
  FOR UPDATE;

  IF v_current_credits < p_amount THEN
    RETURN FALSE;
  END IF;

  UPDATE public.users
  SET credits = credits - p_amount
  WHERE id = p_user_id;

  INSERT INTO public.transactions (user_id, amount, type, description)
  VALUES (p_user_id, -p_amount, 'spend', p_description);

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función: recargar créditos (admin)
CREATE OR REPLACE FUNCTION public.add_credits(
  p_user_id    UUID,
  p_amount     INTEGER,
  p_description TEXT DEFAULT 'Recarga de créditos'
)
RETURNS VOID AS $$
BEGIN
  UPDATE public.users
  SET credits = credits + p_amount
  WHERE id = p_user_id;

  INSERT INTO public.transactions (user_id, amount, type, description)
  VALUES (p_user_id, p_amount, 'admin_credit', p_description);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función: obtener siguiente posición en la cola
CREATE OR REPLACE FUNCTION public.get_next_queue_position()
RETURNS INTEGER AS $$
DECLARE
  v_max INTEGER;
BEGIN
  SELECT COALESCE(MAX(position), 0) INTO v_max
  FROM public.queue
  WHERE status = 'pending';
  RETURN v_max + 1;
END;
$$ LANGUAGE plpgsql;

-- Función: reordenar cola por votos
CREATE OR REPLACE FUNCTION public.reorder_queue_by_votes()
RETURNS VOID AS $$
DECLARE
  r   RECORD;
  pos INTEGER := 2; -- posición 1 = canción actual (playing)
BEGIN
  FOR r IN
    SELECT id FROM public.queue
    WHERE status = 'pending'
    ORDER BY votes_up DESC, created_at ASC
  LOOP
    UPDATE public.queue SET position = pos WHERE id = r.id;
    pos := pos + 1;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función: avanzar a la siguiente canción
CREATE OR REPLACE FUNCTION public.advance_queue()
RETURNS UUID AS $$
DECLARE
  v_next_id UUID;
BEGIN
  -- Marcar canción actual como "played"
  UPDATE public.queue
  SET status = 'played'
  WHERE status = 'playing';

  -- Obtener y marcar la siguiente como "playing"
  SELECT id INTO v_next_id
  FROM public.queue
  WHERE status = 'pending'
  ORDER BY position ASC
  LIMIT 1;

  IF v_next_id IS NOT NULL THEN
    UPDATE public.queue
    SET status = 'playing', position = 1
    WHERE id = v_next_id;

    -- Actualizar plays_count de la canción
    UPDATE public.songs s
    SET plays_count = plays_count + 1
    FROM public.queue q
    WHERE q.id = v_next_id AND q.song_id = s.id;
  END IF;

  RETURN v_next_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE public.users       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.songs       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.queue       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes       ENABLE ROW LEVEL SECURITY;

-- USERS policies
CREATE POLICY "users: todos pueden leer perfiles"
  ON public.users FOR SELECT USING (true);

CREATE POLICY "users: usuario actualiza el propio"
  ON public.users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "users: admin actualiza cualquiera"
  ON public.users FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- SONGS policies
CREATE POLICY "songs: lectura pública"
  ON public.songs FOR SELECT USING (true);

CREATE POLICY "songs: solo admin puede insertar"
  ON public.songs FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "songs: solo admin puede actualizar"
  ON public.songs FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "songs: solo admin puede eliminar"
  ON public.songs FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- QUEUE policies
CREATE POLICY "queue: lectura pública"
  ON public.queue FOR SELECT USING (true);

CREATE POLICY "queue: usuario autenticado inserta"
  ON public.queue FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "queue: solo admin elimina"
  ON public.queue FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "queue: solo admin actualiza status"
  ON public.queue FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- TRANSACTIONS policies
CREATE POLICY "transactions: usuario ve las propias"
  ON public.transactions FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "transactions: admin ve todas"
  ON public.transactions FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "transactions: solo sistema inserta"
  ON public.transactions FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- VOTES policies
CREATE POLICY "votes: lectura pública"
  ON public.votes FOR SELECT USING (true);

CREATE POLICY "votes: usuario autenticado inserta el propio"
  ON public.votes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "votes: usuario elimina el propio"
  ON public.votes FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- REALTIME: habilitar publicaciones
-- ============================================================

ALTER PUBLICATION supabase_realtime ADD TABLE public.queue;
ALTER PUBLICATION supabase_realtime ADD TABLE public.votes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.users;
