import { useState } from 'react'

/**
 * Contador que sube cada vez que `value` aumenta (no en el primer render). Sirve de `key` para
 * repetir una animación de celebración, p. ej. al subir la racha.
 */
export function useBumpKey(value: number): number {
  const [previous, setPrevious] = useState(value)
  const [bumpKey, setBumpKey] = useState(0)
  if (value !== previous) {
    setPrevious(value)
    if (value > previous) setBumpKey((key) => key + 1)
  }
  return bumpKey
}
