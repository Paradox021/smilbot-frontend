/**
 * Sistema de movimiento (DESIGN.md, "Movimiento"). Valores para Motion: duraciones en segundos.
 * Lo que vive en el bundle principal usa sus equivalentes en CSS (`index.css`: `--ease-*`, `--animate-*`).
 */
export const DURATION = {
  /** Hover y pulsado. */
  fast: 0.15,
  /** Entradas de elementos y cambios de estado. */
  base: 0.25,
  /** Apertura del sobre y transiciones grandes. */
  slow: 0.4,
} as const

/** Arranca rápido y frena al final (`--ease-out-expo`). */
export const EASE_OUT = [0.16, 1, 0.3, 1] as const

export const SPRING = {
  /** Rígido y sin rebote: botones, pestañas. */
  snappy: { type: 'spring', stiffness: 520, damping: 40 },
  /** Con un rebote: bocadillo de Smilbot, insignias, huellas. */
  bouncy: { type: 'spring', stiffness: 420, damping: 15 },
} as const
