# 🎵 Rocko — Jukebox Digital

Rockola web en tiempo real construida con Next.js 16, Supabase y Tailwind CSS v4.

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16 (App Router) |
| Lenguaje | TypeScript estricto |
| UI | Tailwind CSS v4 + shadcn/ui |
| Animaciones | Framer Motion |
| Estado | Zustand |
| Backend/Auth/DB | Supabase (PostgreSQL) |
| Realtime + Presence | Supabase Realtime |
| Reproductor | YouTube IFrame API (react-youtube) |

## Setup rápido

### 1. Instalar dependencias

```bash
npm install
```

### 2. Variables de entorno

```bash
cp .env.local.example .env.local
```

Edita `.env.local` con tus credenciales de Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
```

### 3. Base de datos

En el **SQL Editor de Supabase**, ejecuta en orden:

```
1. supabase/schema.sql   — Tablas, funciones, RLS, triggers
2. supabase/seed.sql     — 20 canciones de ejemplo
```

### 4. Usuarios de prueba

1. Ve a **Supabase Dashboard → Authentication → Users**
2. Crea manualmente:
   - `admin@rocko.app` / `admin1234`
   - `user@rocko.app` / `user1234`
3. Ejecuta en SQL Editor para asignar rol admin:
   ```sql
   UPDATE public.users SET role = 'admin', credits = 500
   WHERE email = 'admin@rocko.app';
   ```

### 5. Desarrollo local

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## Funcionalidades

### Usuario regular
- Reproducción de YouTube con artwork estilo vinilo giratorio
- Sistema de créditos (50 al registrarse, 5 por canción)
- Votación: skip (se activa al 60% de usuarios activos) y upvote para reordenar
- Usuarios conectados en tiempo real (Supabase Presence)
- Cola sincronizada entre todos los clientes
- Catálogo con búsqueda y filtro por género

### Admin (`/admin`)
- Dashboard con métricas
- CRUD de canciones (pegar URL de YouTube)
- Gestión de usuarios: recargar créditos, banear
- Skip forzado de canciones desde los controles

## Estructura de carpetas

```
app/
  page.tsx              # Vista principal (requiere auth)
  auth/login/           # Inicio de sesión
  auth/register/        # Registro
  admin/                # Panel admin (requiere rol admin)
  api/
    queue/              # Cola: GET, POST, next/POST
    songs/              # Catálogo: GET
    votes/              # Votación: POST
    credits/            # Créditos: GET, POST
    admin/              # Rutas protegidas para admin

components/
  jukebox/              # JukeboxClient, JukeboxFrame, NowPlaying, SpinningDisc, PlayerControls
  queue/                # QueueList, QueueItem, VoteButtons
  catalog/              # SongCatalog, SongCard, AddToQueue
  credits/              # CreditDisplay, CreditHistory
  admin/                # AdminSidebar, SongForm, UserTable
  layout/               # TopBar
  providers.tsx         # Auth state + Sonner

lib/
  store/                # jukeboxStore.ts, userStore.ts (Zustand)
  hooks/                # useQueue, useYouTube, useVoting, useCredits, usePresence
  supabase/             # client.ts, server.ts
  types/                # Tipos TypeScript compartidos
  utils/                # youtube.ts (helpers)

supabase/
  schema.sql            # Tablas, RLS, funciones, triggers
  seed.sql              # 20 canciones + instrucciones de usuarios
```

## Costo de créditos

| Acción | Costo |
|---|---|
| Agregar canción a la cola | 5 créditos |
| Registro nuevo usuario | 50 créditos gratis |
| Recarga por admin | Variable |

## Realtime

- **Postgres Changes**: tabla `queue` suscrita para sincronizar cola entre clientes
- **Presence**: canal `jukebox-presence` para contar usuarios conectados
- Requiere que `queue` y `votes` estén en la publicación `supabase_realtime` (incluido en schema.sql)
