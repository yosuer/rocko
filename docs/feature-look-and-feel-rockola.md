# Feature: Look and Feel de la Rockola

## Objetivo

Permitir al usuario elegir el aspecto visual (tema / look and feel) de la aplicación Rocko desde una **página de configuración**. La preferencia debe persistir (por usuario o en `localStorage`) y aplicarse de forma consistente en toda la app.

## Ubicación

- **Página de configuración**: por ejemplo `/configuracion`, `/ajustes` o `/settings`.
- En esa página, una sección dedicada: **“Apariencia”** o **“Look and feel de la rockola”**.
- Selector con **4 opciones** de tema, descritas abajo.

---

## Las 4 opciones de Look and Feel

### 1. **Clásico (Vintage Jukebox)** — *actual*

- **Descripción**: Aspecto de rockola clásica de los 50–60: madera oscura, dorado y rubí.
- **Características**:
  - Fondo marrón muy oscuro (`oklch(0.10 0.022 40)`).
  - Tarjetas y paneles con sensación de madera oscura.
  - **Primario**: dorado (`oklch(0.71 0.145 85)`).
  - **Acento**: rojo rubí (`oklch(0.48 0.175 25)`).
  - Secundario cromado/plateado.
  - Bordes y detalles dorados tenues.
  - Utilidades: `.wood-texture`, `.gold-button`, `.chrome-button`, `.neon-gold`, `.jukebox-frame`.
- **Fuente display**: Playfair Display (serif elegante).
- **Ideal para**: Quien quiera la experiencia “rockola retro” por defecto.

---

### 2. **Neón (Arcade / Bar 80s)**

- **Descripción**: Estilo arcade / bar de los 80: fondo negro, neones cyan, magenta y verde.
- **Características**:
  - Fondo negro o casi negro (`oklch(0.08 0.01 270)`).
  - **Primario**: cyan neón (`oklch(0.75 0.15 195)`).
  - **Acento**: magenta/fucsia (`oklch(0.65 0.22 330)`).
  - Acentos secundarios: verde neón (`oklch(0.75 0.18 145)`).
  - Sombras tipo glow en botones y elementos destacados.
  - Sin textura de madera; bordes rectos o ligeramente redondeados.
- **Tipografía**: Mantener Inter/JetBrains; opcionalmente una display más “tech” (ej. Orbitron solo en títulos).
- **Ideal para**: Ambiente fiesta, bares, eventos con mucha luz neón.

---

### 3. **Minimal (Moderno / Limpio)**

- **Descripción**: Interfaz minimalista, sin referencias retro; grises y un solo acento.
- **Características**:
  - Fondo gris muy oscuro neutro (`oklch(0.14 0.01 260)`).
  - **Primario**: un solo color de acento (ej. azul frío `oklch(0.55 0.18 250)` o verde menta `oklch(0.65 0.12 165)`).
  - Sin dorado, sin rubí, sin texturas de madera ni cromo.
  - Bordes sutiles, radios consistentes (ej. `--radius: 0.5rem`).
  - Cards planas, sin gradientes decorativos.
- **Tipografía**: Inter como principal; Playfair solo si se desea un contraste sutil en títulos.
- **Ideal para**: Usuarios que prefieren una app “moderna” y discreta.

---

### 4. **Vinilo (Cálido / Sala de discos)**

- **Descripción**: Sensación de sala de discos o tienda de vinilos: tonos cálidos y acogedores.
- **Características**:
  - Fondo marrón/café cálido (`oklch(0.18 0.03 55)`).
  - **Primario**: ámbar o mostaza (`oklch(0.72 0.12 75)`).
  - **Acento**: terracota o óxido (`oklch(0.55 0.12 40)`).
  - Tarjetas en tonos crema oscuro / beige (`oklch(0.25 0.02 75)`).
  - Bordes y separadores en tonos tierra.
  - Opcional: detalle visual de “vinilo” (círculos, líneas finas) en algún componente (ej. reproductor o portada).
- **Tipografía**: Playfair Display encaja bien; Inter para cuerpo.
- **Ideal para**: Ambiente íntimo, cafetería, sala de escucha.

---

## Resumen para la UI de configuración

| Nombre en UI   | Id / valor  | Descripción corta (tooltip o label)                    |
|----------------|-------------|--------------------------------------------------------|
| Clásico        | `classic`   | Rockola vintage: madera, dorado y rubí                  |
| Neón           | `neon`      | Estilo arcade años 80: neones cyan y magenta           |
| Minimal        | `minimal`   | Diseño moderno y limpio, un solo acento                |
| Vinilo         | `vinyl`     | Tonos cálidos, sala de discos                          |

---

## Requerimientos técnicos sugeridos

1. **Persistencia**: Guardar la elección en `localStorage` (ej. `rocko-theme`) o en perfil de usuario en Supabase si existe.
2. **Aplicación del tema**:  
   - Añadir una clase al `<html>` (ej. `data-theme="classic"` | `neon` | `minimal` | `vinyl`) o usar CSS variables que se sobrescriban por tema.
3. **CSS**:  
   - Definir en `globals.css` (o en archivos por tema) las variables `--background`, `--foreground`, `--primary`, `--accent`, etc. para cada valor de `data-theme`.
4. **Página de configuración**:  
   - Ruta dedicada (ej. `/configuracion`).  
   - Sección “Apariencia” con 4 tarjetas o botones que muestren una miniatura/preview del tema y al elegir uno se actualice la clase/variables y se guarde la preferencia.
5. **Sin flash**: Si se usa `localStorage`, leer el tema antes del primer paint (script en `<head>` o en el layout) para evitar parpadeo.

---

## Prompt resumido (para usar con IA o equipo)

**“Implementar en Rocko una página de configuración con una sección ‘Apariencia’ donde el usuario pueda elegir entre 4 looks: (1) Clásico — rockola vintage madera/dorado/rubí; (2) Neón — arcade 80s cyan/magenta; (3) Minimal — moderno gris y un acento; (4) Vinilo — cálido sala de discos ámbar/terracota. La preferencia debe persistir (localStorage o usuario) y aplicarse con CSS variables y `data-theme` en `<html>` sin flash en la carga.”**

Si quieres, el siguiente paso puede ser esbozar la estructura de la página `/configuracion` y los nombres exactos de las variables CSS por tema.
