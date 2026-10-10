import type { Card } from '@/features/cards'

export interface InventoryCard extends Card {
  count: number
}

/**
 * Respuesta de `GET /user/:id/cards`: el `User` con `cards` poblado (solo `count > 0`).
 * Solo se tipan los campos que usa el frontend.
 */
export interface Inventory {
  discordId: string
  cards: InventoryCard[]
}
