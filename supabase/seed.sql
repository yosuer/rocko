-- ============================================================
-- ROCKO JUKEBOX - Seed de datos de ejemplo
-- IMPORTANTE: Ejecutar DESPUÉS de schema.sql
-- Los usuarios de prueba deben crearse primero en Supabase Auth
-- luego actualizar los UUIDs aquí.
-- ============================================================

-- Canciones populares del catálogo (20 tracks)
INSERT INTO public.songs (title, artist, youtube_url, youtube_id, thumbnail, duration, genre) VALUES
('Bohemian Rhapsody',        'Queen',              'https://www.youtube.com/watch?v=fJ9rUzIMcZQ', 'fJ9rUzIMcZQ', 'https://img.youtube.com/vi/fJ9rUzIMcZQ/maxresdefault.jpg', 354, 'Rock'),
('Hotel California',         'Eagles',             'https://www.youtube.com/watch?v=EqPtz5qN7HM', 'EqPtz5qN7HM', 'https://img.youtube.com/vi/EqPtz5qN7HM/maxresdefault.jpg', 391, 'Rock'),
('Smells Like Teen Spirit',  'Nirvana',            'https://www.youtube.com/watch?v=hTWKbfoikeg', 'hTWKbfoikeg', 'https://img.youtube.com/vi/hTWKbfoikeg/maxresdefault.jpg', 301, 'Grunge'),
('Sweet Child O'' Mine',     'Guns N'' Roses',     'https://www.youtube.com/watch?v=1w7OgIMMRc4', '1w7OgIMMRc4', 'https://img.youtube.com/vi/1w7OgIMMRc4/maxresdefault.jpg', 356, 'Rock'),
('Don''t Stop Believin''',   'Journey',            'https://www.youtube.com/watch?v=1k8craCGpgs', '1k8craCGpgs', 'https://img.youtube.com/vi/1k8craCGpgs/maxresdefault.jpg', 251, 'Rock'),
('Mr. Brightside',           'The Killers',        'https://www.youtube.com/watch?v=gGdGFtwCNBE', 'gGdGFtwCNBE', 'https://img.youtube.com/vi/gGdGFtwCNBE/maxresdefault.jpg', 222, 'Indie Rock'),
('Lose Yourself',            'Eminem',             'https://www.youtube.com/watch?v=_Yhyp-_hX2s', '_Yhyp-_hX2s', 'https://img.youtube.com/vi/_Yhyp-_hX2s/maxresdefault.jpg', 326, 'Hip-Hop'),
('Billie Jean',              'Michael Jackson',    'https://www.youtube.com/watch?v=Zi_XLOBDo_Y', 'Zi_XLOBDo_Y', 'https://img.youtube.com/vi/Zi_XLOBDo_Y/maxresdefault.jpg', 294, 'Pop'),
('Africa',                   'Toto',               'https://www.youtube.com/watch?v=FTQbiNvZqaY', 'FTQbiNvZqaY', 'https://img.youtube.com/vi/FTQbiNvZqaY/maxresdefault.jpg', 295, 'Pop Rock'),
('Under the Bridge',         'Red Hot Chili Peppers', 'https://www.youtube.com/watch?v=lwAWI4-OBYU', 'lwAWI4-OBYU', 'https://img.youtube.com/vi/lwAWI4-OBYU/maxresdefault.jpg', 264, 'Alternative'),
('Wonderwall',               'Oasis',              'https://www.youtube.com/watch?v=bx1Bh8ZvH84', 'bx1Bh8ZvH84', 'https://img.youtube.com/vi/bx1Bh8ZvH84/maxresdefault.jpg', 258, 'Britpop'),
('Somebody That I Used to Know', 'Gotye',          'https://www.youtube.com/watch?v=8UVNT4wvIGY', '8UVNT4wvIGY', 'https://img.youtube.com/vi/8UVNT4wvIGY/maxresdefault.jpg', 244, 'Indie Pop'),
('Rolling in the Deep',      'Adele',              'https://www.youtube.com/watch?v=rYEDA3JcQqw', 'rYEDA3JcQqw', 'https://img.youtube.com/vi/rYEDA3JcQqw/maxresdefault.jpg', 228, 'Soul'),
('Shape of You',             'Ed Sheeran',         'https://www.youtube.com/watch?v=JGwWNGJdvx8', 'JGwWNGJdvx8', 'https://img.youtube.com/vi/JGwWNGJdvx8/maxresdefault.jpg', 234, 'Pop'),
('Blinding Lights',          'The Weeknd',         'https://www.youtube.com/watch?v=4NRXx6U8ABQ', '4NRXx6U8ABQ', 'https://img.youtube.com/vi/4NRXx6U8ABQ/maxresdefault.jpg', 200, 'Synth-pop'),
('Old Town Road',            'Lil Nas X',          'https://www.youtube.com/watch?v=w2Ov5jzm3j8', 'w2Ov5jzm3j8', 'https://img.youtube.com/vi/w2Ov5jzm3j8/maxresdefault.jpg', 113, 'Country Rap'),
('bad guy',                  'Billie Eilish',      'https://www.youtube.com/watch?v=DyDfgMOUjCI', 'DyDfgMOUjCI', 'https://img.youtube.com/vi/DyDfgMOUjCI/maxresdefault.jpg', 194, 'Electropop'),
('Uptown Funk',              'Bruno Mars',         'https://www.youtube.com/watch?v=OPf0YbXqDm0', 'OPf0YbXqDm0', 'https://img.youtube.com/vi/OPf0YbXqDm0/maxresdefault.jpg', 270, 'Funk Pop'),
('Get Lucky',                'Daft Punk ft. Pharrell Williams', 'https://www.youtube.com/watch?v=5NV6Rdv1a3I', '5NV6Rdv1a3I', 'https://img.youtube.com/vi/5NV6Rdv1a3I/maxresdefault.jpg', 248, 'Disco Funk'),
('Thinking Out Loud',        'Ed Sheeran',         'https://www.youtube.com/watch?v=lp-EO5I60KA', 'lp-EO5I60KA', 'https://img.youtube.com/vi/lp-EO5I60KA/maxresdefault.jpg', 281, 'Pop');

-- ============================================================
-- NOTA: Para crear usuarios de prueba:
-- 1. Ve a Supabase Dashboard → Authentication → Users
-- 2. Crea: admin@rocko.app (password: admin1234)
--           user@rocko.app  (password: user1234)
-- 3. Copia los UUIDs generados y reemplaza abajo:
-- ============================================================

-- Actualizar rol admin (reemplaza 'ADMIN_USER_UUID' con el UUID real)
-- UPDATE public.users SET role = 'admin', credits = 500 WHERE email = 'admin@rocko.app';

-- Créditos de bienvenida (el trigger ya asigna 50 al registrarse)
-- UPDATE public.users SET credits = 100 WHERE email = 'user@rocko.app';
