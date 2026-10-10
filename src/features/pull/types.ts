import type { Card } from '@/features/cards'

/** Respuesta de `POST /user/:id/card/random`. Ver `Backend API/Endpoints Cartas.md`. */
export interface PullResult extends Card {
  /** Tirada 0-999; `null` si la carta salió por pity. */
  roll: number | null
  isPity: boolean
  pity: {
    current: number
    threshold: number
    remaining: number
  }
}

export interface PullOutcome {
  result: PullResult
  /** Primera copia de la carta; `null` si no se conocía el inventario antes de tirar. */
  isNew: boolean | null
}
