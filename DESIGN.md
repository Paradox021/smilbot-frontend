---
version: 1
name: Smilbot
description: |
  Identidad de la web de Smilbot, un juego de colección de cartas de gatitos cuya mascota es
  un gato naranja. Oscuro y cálido: fondo azul tinta, texto crema y un naranja de marca escaso.
  La interfaz es un escenario sobrio; el color fuerte lo ponen las cartas y sus rarezas.

colors:
  background: "#0D111C"
  card: "#171E2D"
  secondary: "#1F2738"
  popover: "#1F2738"
  muted: "#252E42"
  accent: "#252E42"
  border: "#283149"
  input: "#36405A"
  foreground: "#F3EEE7"
  body: "#D9D3CA"
  muted-foreground: "#A8A29A"
  primary: "#FFAD62"
  primary-pressed: "#F29A4A"
  primary-foreground: "#0D111C"
  ring: "rgba(255,173,98,0.6)"
  success: "#5CD49B"
  warning: "#F5C451"
  destructive: "#FF7A70"

rarities:
  common: "#808080"
  rare: "#0070dd"
  epic: "#a335ee"
  legendary: "#ff8000"
  mythic: "#c45039"

typography:
  heading: "Nunito Variable, 700/800"
  body: "Inter Variable (ss03), 400/500/600"

rounded:
  pill: "9999px"
  panel: "16px"
  collectible-card: "12px"
  input: "12px"
---

# Smilbot: sistema de diseño

La decisión y su porqué están en la bóveda (`Frontend/Rediseno Visual.md`). Este documento es la
referencia para implementar: tokens, reglas y componentes. Los tokens viven en `src/index.css`;
nunca uses valores sueltos en los componentes.

## Principios

1. **Oscuro y cálido.** Fondo azul tinta, texto crema y naranja de marca. Nada de negro neutro ni
   de blanco puro.
2. **Las cartas mandan.** La interfaz es sobria; las ilustraciones y los colores de rareza ponen el
   color. Un color fuerte significa rareza.
3. **El naranja es Smilbot.** Acción principal, logo, foco y mascota. Es escaso a propósito: si todo
   es naranja, nada destaca.
4. **Amable, no infantil.** Formas redondeadas, títulos con carácter y textos cercanos, con una
   interfaz que se lee sin esfuerzo.
5. **Mobile first.** La mayoría llega desde Discord en el móvil.

Solo hay modo oscuro.

## Color

| Token | Clase Tailwind | Valor | Uso |
| :--- | :--- | :--- | :--- |
| `--background` | `bg-background` | `#0D111C` | Fondo de la página |
| `--card` | `bg-card` | `#171E2D` | Tarjetas, nav inferior, cartas |
| `--secondary` / `--popover` | `bg-secondary`, `bg-popover` | `#1F2738` | Superficie elevada: menús, botón secundario, pestaña activa, píldora del saldo |
| `--muted` / `--accent` | `bg-muted` | `#252E42` | Rellenos suaves: skeletons, pistas de progreso, hover |
| `--border` | `border-border` | `#283149` | Borde sutil de 1 px |
| `--input` | `border-input` | `#36405A` | Borde de campos |
| `--foreground` | `text-foreground` | `#F3EEE7` | Texto principal (crema) |
| `--body` | `text-body` | `#D9D3CA` | Párrafos |
| `--muted-foreground` | `text-muted-foreground` | `#A8A29A` | Texto secundario |
| `--primary` | `bg-primary`, `text-primary` | `#FFAD62` | Naranja Smilbot |
| `--primary-pressed` | `bg-primary-pressed` | `#F29A4A` | Hover y pulsado del naranja |
| `--primary-foreground` | `text-primary-foreground` | `#0D111C` | Texto sobre naranja |
| `--ring` | `ring-ring` | naranja al 60 % | Foco (ya lleva la opacidad: no uses `ring-ring/50`) |
| `--success` | `text-success` | `#5CD49B` | Éxito, saldo que sube |
| `--warning` | `text-warning` | `#F5C451` | Racha en peligro |
| `--destructive` | `text-destructive` | `#FF7A70` | Errores |

**Contraste:** crema sobre el fondo ≈ 16:1; texto secundario sobre superficie ≈ 6,6:1; texto oscuro
sobre naranja ≈ 10:1. **El texto blanco sobre naranja no pasa AA (1,8:1)**: el botón principal
siempre lleva `text-primary-foreground`.

### Rarezas

Coinciden con los embeds del bot y se definen una sola vez en `shared/config/rarities.ts` (en los
componentes, vía `rarityStyle()` y la variable `--rarity`). No cambian con la identidad. La rareza
nunca se comunica solo con color: siempre va su nombre.

### Reglas

- **Sin violeta ni otros acentos de marca.** El violeta se confundiría con Épica.
- **El naranja de marca nunca marca una carta.** Legendaria es `#ff8000`, de la misma familia: nada
  de marcos, brillos ni insignias de carta en `primary`. La insignia "Nueva" va en naranja pero
  **fuera** del marco.
- **Sin degradados de marca ni neón.** El único brillo cálido es el halo de la mascota; los brillos
  de color son los de las rarezas en la tirada.

## Tipografía

| Uso | Fuente | Clases |
| :--- | :--- | :--- |
| Títulos (`h1`-`h3` la usan por defecto), logo, cifras destacadas | Nunito | `font-heading font-extrabold` / `font-bold` |
| Texto, botones, etiquetas, tablas | Inter con `ss03` | `font-sans` (por defecto) |

| Nivel | Tamaño | Peso |
| :--- | :--- | :--- |
| Título del login | `text-4xl` → `md:text-[3.5rem]` | 800 |
| H1 de página | `text-3xl` → `md:text-4xl` | 800 |
| H2 de sección o tarjeta | `text-lg`-`text-xl` | 700 |
| Cifra destacada (saldo, racha, cuenta atrás) | `text-3xl` | 800, `tabular-nums` |
| Texto | 15-16 px | 400 |
| Secundario | `text-sm` | 400-500 |
| Etiquetas | `text-xs` | 500 |

- Los números que se comparan llevan siempre `tabular-nums`.
- El *eyebrow* en mayúsculas espaciadas solo se usa en el login.

## Formas y profundidad

| Elemento | Radio | Clase |
| :--- | :--- | :--- |
| Botones, chips, insignias, píldora del saldo, pestañas | Píldora | `rounded-full` |
| Tarjetas y paneles, menús, diálogos | 16 px | `rounded-lg` |
| Cartas coleccionables, campos de formulario | 12 px | `rounded-md` |
| Elementos pequeños dentro de un panel (items de menú, celdas) | 8 px | `rounded-sm` |

- **Profundidad por superficies, no por sombras:** fondo → `card` → `secondary`. Las tarjetas no
  llevan borde si se apoyan sobre el fondo; el borde de 1 px solo donde la superficie no basta.
- **Más aire, menos cajas:** agrupa con espacio y títulos antes que anidando tarjetas.
- **Animación** solo con `transform` y `opacity`, y siempre respetando `prefers-reduced-motion`.

## La mascota

Smilbot (el gato naranja) aparece donde la app tiene que tener voz, no como decoración:

| Dónde | Cómo |
| :--- | :--- |
| Login | Grande (192 px en móvil, 280 px en escritorio), con halo y motas de luz fijas |
| 404, errores y estados vacíos | Mediana (unos 144 px), con halo y un texto cercano |
| Logo de la cabecera | 32 px, sin halo |
| Favicon | `public/favicon-32.png` y `public/apple-touch-icon.png` |

- Componente `Mascot` (`shared/ui/mascot.tsx`): siempre en círculo, centrado en la cara y con las
  orejas dentro. Recibe el tamaño por `className` y el ancho mostrado por `sizes` para elegir
  fichero (`src/assets/mascot/smilbot-128|320|640.webp`).
- **Nunca** a más de 280 px, a sangre ni en rectángulo: la foto es de baja resolución (escalada 4×).
- No aparece en las pantallas de datos (Inicio, Colección, Rankings) salvo en sus estados vacíos.

## Componentes

| Componente | Definición |
| :--- | :--- |
| Botón principal (`Button`) | Píldora naranja con texto oscuro. **Uno por pantalla como máximo** (p. ej. en Inicio, el daily si está disponible; si no, "Abrir un sobre"). |
| Botón secundario (`variant="secondary"`) | Píldora en `secondary` con texto crema y borde sutil. |
| Botón fantasma (`variant="ghost"`) | Sin fondo, texto secundario; hover en `muted`. |
| Tarjeta de interfaz (`Card`) | `bg-card`, `rounded-lg`, sin sombra ni borde. La destacada de la pantalla (daily) va en `bg-secondary`. |
| Carta coleccionable (`CardFront`, `CardBack`) | Marco de 1 px del color de su rareza, imagen entera a su proporción, nombre debajo, `rounded-md`, fondo `card`. El dorso lleva una huella. |
| Píldora del saldo | `secondary`, moneda en naranja y cifra en Nunito. |
| Insignias (`Badge`) | Píldora. "Nueva" en naranja (fuera de la carta); las demás en `secondary`. |
| Navegación | Escritorio: pestañas en píldora, la activa en `secondary`. Móvil: barra inferior en `card`, icono activo en naranja. |
| Progreso | Pista `muted` y relleno crema (o el color de la rareza si mide rarezas). |
| Foco | `ring-ring` (naranja al 60 %) en todos los controles. |

## Tono de los textos

- Cercano y breve, en español de tú: "Abre tu primer sobre", "Smilbot no encuentra esta página".
- Un guiño gatuno de vez en cuando en estados vacíos y celebraciones ("¡Miau! Carta nueva"), nunca
  en errores ni en textos de dinero.
- Los textos funcionales (botones, errores, saldo) son claros y directos.

## Responsive

- Diseña primero para 360-390 px, con 16 px de margen lateral y sin scroll horizontal.
- En móvil la navegación va abajo (zona del pulgar) y el contenido deja sitio con `pb-28`.
- Objetivos táctiles de 40 px o más (`Button` mide 40 px; `size="lg"`, 48 px).
