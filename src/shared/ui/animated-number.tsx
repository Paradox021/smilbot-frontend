import { useLayoutEffect, useRef } from 'react'
import { prefersReducedMotion } from '@/shared/lib/motion'

interface AnimatedNumberProps {
  value: number
  /** Debe ser estable (función de módulo o memorizada). */
  format: (value: number) => string
  className?: string
}

const DURATION_MS = 800

/** Curva `cubic-bezier(0.16, 1, 0.3, 1)` aproximada: arranca rápido y frena al final. */
const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - 2 ** (-10 * t))

/**
 * Número que cuenta hasta su nuevo valor cuando cambia (p. ej. el saldo tras reclamar el daily).
 * El primer render no anima. Los lectores de pantalla solo leen el valor final.
 *
 * No usa Motion a propósito: vive en la cabecera (bundle principal) y la librería pesa ~75 kB gzip.
 * La animación escribe en el nodo directamente, sin re-renderizar React en cada frame.
 */
export function AnimatedNumber({ value, format, className }: AnimatedNumberProps) {
  const nodeRef = useRef<HTMLSpanElement>(null)
  const shownRef = useRef(value)

  useLayoutEffect(() => {
    const node = nodeRef.current
    if (!node) return
    const from = shownRef.current
    const show = (current: number) => {
      shownRef.current = current
      node.textContent = format(current)
    }

    if (from === value || prefersReducedMotion()) {
      show(value)
      return
    }

    let frame = 0
    const start = performance.now()
    const tick = (time: number) => {
      const progress = Math.min(1, (time - start) / DURATION_MS)
      show(Math.round(from + (value - from) * easeOutExpo(progress)))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [format, value])

  return (
    <span className={className}>
      <span ref={nodeRef} aria-hidden />
      <span className="sr-only">{format(value)}</span>
    </span>
  )
}
