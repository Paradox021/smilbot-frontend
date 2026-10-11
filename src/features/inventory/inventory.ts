import type { Card } from '@/features/cards'
import type { Inventory } from './types'

/** Copias de una carta en el inventario (`0` si no la tiene). */
export function countCopies(inventory: Inventory, cardId: string): number {
  return inventory.cards.find((card) => card._id === cardId)?.count ?? 0
}

/** Inventario con una copia más de `card` (la añade si no estaba). No muta el original. */
export function addCardToInventory(inventory: Inventory, card: Card): Inventory {
  const owned = inventory.cards.some((entry) => entry._id === card._id)
  const cards = owned
    ? inventory.cards.map((entry) =>
        entry._id === card._id ? { ...entry, count: entry.count + 1 } : entry,
      )
    : [...inventory.cards, { ...card, count: 1 }]
  return { ...inventory, cards }
}
