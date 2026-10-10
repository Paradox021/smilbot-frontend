# AGENTS.md - Reglas e Instrucciones para Agentes de IA en Smilbot Frontend

Frontend web de **Smilbot**: una SPA en React + TypeScript que consume el **Backend API de Smilbot** (Express + MongoDB). Permite a los usuarios iniciar sesión con Discord y consultar su perfil, inventario de cartas gacha, mercado P2P y leaderboards.

Este documento fija el stack, la arquitectura y las reglas obligatorias para cualquier cambio. El objetivo es un proyecto **modular, fácil de escalar y de mantener** desde el primer commit.

---

## 🚨 Regla de Oro: Definition of Done

> **NINGUNA tarea se considera terminada si cambia algo que el resto del ecosistema deba conocer y no está reflejado en la Bóveda de Obsidian.**

### 📚 Bóveda Centralizada (Single Source of Truth)
- **Ruta local:** `../smilbot-vault` (carpeta hermana de este repo dentro de `smilbot-project/`).
- **Repositorio:** [Paradox021/smilbot-vault](https://github.com/Paradox021/smilbot-vault)
- **Notas que hay que leer antes de empezar:**
  - `Backend API/Autenticacion.md`: login, cookies, refresh, errores y matriz de permisos.
  - `Backend API/Endpoints *.md`: contratos de cada endpoint.
  - `Modelos y Contratos/*.md`: modelos (`User`, `Card`, `MarketOffer`, `Transaction`), rarezas, economía, pity y suerte.
  - `Frontend/Arquitectura Frontend.md`: decisiones del frontend que conoce el resto del ecosistema.
  - `Frontend/Pendientes Frontend.md`: necesidades del backend, incoherencias de la bóveda y pendientes del frontend.

### Los contratos de la API no se inventan
- Los tipos y llamadas a la API se escriben **según la bóveda**. Si una nota y el comportamiento real no coinciden, avisa en vez de adaptar el frontend en silencio.
- Si una pantalla necesita un endpoint o dato que no existe, **no lo simules ni lo calcules a base de muchas peticiones**: detente, apúntalo en `Frontend/Pendientes Frontend.md` y propón el cambio en el backend (y en su nota de la bóveda).
- Si cambias algo que afecta al ecosistema (variables de entorno, URL de despliegue, rutas), actualiza `Frontend/Arquitectura Frontend.md`. Si creas una nota nueva, enlázala en el `README.md` de la bóveda.

---

## 🛠️ Stack

| Área | Tecnología |
| :--- | :--- |
| Build | **Vite** |
| UI | **React** + **TypeScript** (`strict: true`) |
| Rutas | **React Router** (modo librería, SPA; sin framework mode / SSR) |
| Datos del servidor | **TanStack Query** |
| Estilos | **Tailwind CSS** + **shadcn/ui** |
| Animaciones | **Motion** (`motion/react`) |
| Formularios y validación | **React Hook Form** + **Zod** |
| Tests | **Vitest** + **Testing Library** + **MSW** (mock de la API) |
| Calidad | **ESLint** + **Prettier** |

- Usa las versiones estables más recientes al inicializar y no añadas dependencias fuera de esta tabla sin justificarlo.
- **Nada de** Redux/Zustand por defecto: el estado del servidor vive en TanStack Query y el de la UI en estado local o contexto. Solo se añade una store global si aparece un caso real que lo necesite.
- **Nada de** axios: un único cliente basado en `fetch` (ver más abajo).

---

## 📁 Estructura (por funcionalidad)

```
src/
  app/                  # arranque: router, providers (QueryClient, tema), layout raíz
  features/
    auth/               # sesión, login/logout, guardas de ruta
    cards/              # catálogo, carta individual, rarezas
    inventory/          # inventario del usuario
    market/             # ofertas, publicar, comprar, cancelar
    leaderboard/        # rankings
    profile/            # perfil y stats
      api.ts            #   llamadas HTTP de la funcionalidad (usa shared/lib/http)
      queries.ts        #   query keys + hooks de TanStack Query (useX / useXMutation)
      types.ts          #   tipos de la API de esta funcionalidad
      components/       #   componentes propios
      pages/            #   páginas enrutables
      index.ts          #   API pública de la funcionalidad
  shared/
    ui/                 # componentes de shadcn/ui y primitivas genéricas
    lib/                # http client, env, utilidades puras
    hooks/              # hooks genéricos (no de dominio)
    types/              # tipos compartidos entre features
    config/             # constantes (rarezas, rutas, etc.)
```

**Reglas de dependencias:**
- `features/*` puede importar de `shared/`. `shared/` **nunca** importa de `features/`.
- Una feature solo importa de otra a través de su `index.ts`, nunca de sus archivos internos.
- `app/` compone features; no contiene lógica de dominio.
- Cada página enrutable se carga de forma diferida (`lazy` en la definición de rutas de React Router), salvo la página inicial y el layout.
- Alias de importación `@/` → `src/`. Nada de rutas relativas largas (`../../..`).

---

## 🔌 Comunicación con la API

### Cliente HTTP único (`shared/lib/http.ts`)
- Base URL desde `import.meta.env.VITE_API_URL`, validada al arrancar (`shared/lib/env.ts` con Zod).
- Todas las peticiones con `credentials: 'include'`: la sesión viaja en **cookies httpOnly** que pone el backend.
- **Nunca** guardes tokens en `localStorage`, `sessionStorage` ni en estado de JS. El frontend no los ve ni los necesita.
- Ante `401` con `code: "TOKEN_EXPIRED"`: llama a `POST /auth/refresh` **una sola vez aunque haya varias peticiones a la vez** (comparte la misma promesa) y reintenta la petición original una vez. Si el refresh falla → la sesión se da por cerrada.
- Los errores se transforman en un tipo `ApiError` (`status`, `message`, `code?`) con el cuerpo `{ error, code? }` que devuelve el backend.
- Los componentes **nunca** llaman a `fetch` ni a `http` directamente: solo usan hooks de `queries.ts`.

### Sesión y login
- **Login:** navegación completa (no `fetch`) a `${VITE_API_URL}/auth/discord`. El backend vuelve a la app con `?login=success` o `?login=error`; léelo, muestra el resultado y limpia el parámetro de la URL.
- **Usuario actual:** `GET /auth/me` con la query key `['auth', 'me']`. Es la única fuente de verdad de "quién soy" y de `isAdmin`.
- **Logout:** `POST /auth/logout` y después `queryClient.clear()`.
- `isAdmin` solo sirve para **ocultar** UI; la autorización real la hace el backend. Nunca confíes en el frontend para proteger nada.
- Un usuario solo puede **modificar** lo suyo (reclamar el saldo diario, tirar carta, operar en el mercado como él mismo). Consulta la matriz de permisos antes de crear una pantalla que modifique datos.

### Datos
- `GET /auth/me` se usa **solo para la identidad** (quién soy, `discordId`, `isAdmin`). Los datos que cambian (saldo, rachas, stats, inventario) se obtienen con queries de su propia feature, y las mutaciones invalidan esas queries. Ninguna pantalla debe mostrar saldo ni stats sacados de `/auth/me`.
- **Los IDs de Discord son `string`**, siempre. Son snowflakes de 64 bits y se corrompen si se convierten a `number`.
- Rareza de carta (`Card.type`): `0` Common, `1` Rare, `2` Epic, `3` Legendary, `4` Mythic. Defínelo una sola vez en `shared/config` (nombre, color, orden) y reutilízalo.
- `Card.imageUrl` es una URL absoluta sea cual sea el proveedor (local, Cloudinary o Supabase; ver `Backend API/Hosting de Imagenes.md`). Puede faltar: muestra siempre una imagen de reserva, desde un único componente de imagen de carta.
- Query keys organizadas con una factoría por feature (`marketKeys.offers(serverId)`), nunca strings sueltas repetidas.
- Tras una mutación, invalida exactamente las queries afectadas (p. ej. comprar invalida ofertas, inventario y balance).

---

## ✍️ Código Limpio

- TypeScript estricto. **Prohibido `any`**; usa `unknown` y estrecha el tipo.
- Componentes pequeños y con una sola responsabilidad. Si un archivo pasa de ~150 líneas o mezcla datos y presentación, divídelo.
- La lógica va en hooks y funciones puras; el JSX solo pinta.
- Exports con nombre (sin `export default`, salvo donde una herramienta lo exija).
- Nombres: `PascalCase` para componentes y tipos, `camelCase` para funciones, hooks `useX`, archivos de componente `PascalCase.tsx`.
- Cada pantalla contempla los estados de **carga, error y vacío**.
- Mobile first y responsive: muchos usuarios entrarán desde el móvil al venir de Discord.
- Accesibilidad básica: HTML semántico, `alt` en imágenes, controles navegables con teclado (shadcn/ui ya ayuda).
- Textos de la interfaz en **español**, en un solo sitio por feature, para poder traducirlos más adelante si hace falta.
- Sin código muerto, sin `console.log` olvidados y sin comentarios que repiten lo que hace el código.

### Diseño visual
- La referencia visual es [`DESIGN.md`](DESIGN.md) (sistema de Raycast, de [awesome-design-md](https://github.com/VoltAgent/awesome-design-md)): paleta, tipografía, radios, bordes y espaciado. Léelo antes de crear o rediseñar UI y llévalo a tokens de Tailwind / variables de shadcn/ui, no a valores sueltos en los componentes.
- Es una inspiración, no una marca: no copies logos, textos ni ilustraciones de Raycast.
- Los colores de rareza siguen definiéndose una sola vez en `shared/config`; los acentos de `DESIGN.md` no los sustituyen.

### Tests
- Lógica pura (helpers, formateo, cliente HTTP y refresh): tests unitarios con Vitest.
- Hooks y páginas: Testing Library con la API mockeada con MSW. No se llama al backend real en los tests.

---

## ⚙️ Entorno

- Variables en `.env` (no se sube a git) y documentadas en `.env.example`:
  - `VITE_API_URL`: URL del backend, p. ej. `http://localhost:3000`.
- Recuerda que todo lo que empieza por `VITE_` **acaba en el bundle público**: nunca pongas secretos en el frontend.
- En el backend, `FRONTEND_URL` debe coincidir exactamente con el origen del frontend (`http://localhost:5173` en desarrollo). Si no, fallan CORS y la comprobación de `Origin`.

---

## 🔁 Flujo de Trabajo

- Trabaja en ramas `feature/...`, `fix/...`, `docs/...`; nunca directamente en `master`/`main`.
- Commits con Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`), igual que en el backend.
- **No** añadas `Co-Authored-By` ni ninguna mención a IA en commits o descripciones de PR.
- Antes de dar algo por terminado: `lint`, `typecheck`, `test` y `build` sin errores, y la bóveda actualizada si procede.
