import { useRef, type PointerEvent } from 'react'

/** Solo cuenta el gesto si empieza en la parte de arriba del sobre, junto a la línea de corte. */
const TEAR_ZONE = 0.4
/** Recorrido horizontal, en proporción al ancho del sobre, para rasgarlo. */
const TEAR_DISTANCE = 0.5

/**
 * Rasgar el sobre deslizando el dedo por la línea de corte. Es un atajo opcional:
 * el botón sigue siendo el camino principal y accesible.
 */
export function useSwipeToTear(enabled: boolean, onTear: () => void) {
  const start = useRef<{ x: number; width: number } | null>(null)
  const reset = () => {
    start.current = null
  }

  return {
    onPointerDown: (event: PointerEvent<HTMLElement>) => {
      if (!enabled) return
      const rect = event.currentTarget.getBoundingClientRect()
      if (event.clientY - rect.top > rect.height * TEAR_ZONE) return
      start.current = { x: event.clientX, width: rect.width }
    },
    onPointerMove: (event: PointerEvent<HTMLElement>) => {
      const from = start.current
      if (!from || Math.abs(event.clientX - from.x) < from.width * TEAR_DISTANCE) return
      reset()
      onTear()
    },
    onPointerUp: reset,
    onPointerCancel: reset,
  }
}
