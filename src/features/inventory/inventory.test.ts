import { addCardToInventory, ownsCard } from './inventory'
import type { Inventory } from './types'

const larry = { _id: 'c1', name: 'SwimmingLarry', description: 'Mítica', type: 4 }
const bob = { _id: 'c2', name: 'Bob', description: 'Común', type: 0 }

const inventory: Inventory = {
  discordId: '123456789012345678',
  cards: [
    { ...larry, count: 2 },
    { ...bob, count: 0 },
  ],
}

describe('ownsCard', () => {
  it('true si tiene al menos una copia', () => {
    expect(ownsCard(inventory, 'c1')).toBe(true)
  })

  it('false si no está o tiene count 0', () => {
    expect(ownsCard(inventory, 'c2')).toBe(false)
    expect(ownsCard(inventory, 'c3')).toBe(false)
  })
})

describe('addCardToInventory', () => {
  it('suma una copia a una carta que ya estaba', () => {
    const next = addCardToInventory(inventory, larry)
    expect(next.cards.find((card) => card._id === 'c1')?.count).toBe(3)
    expect(inventory.cards[0]?.count).toBe(2)
  })

  it('añade una carta nueva con una copia', () => {
    const next = addCardToInventory(inventory, { ...larry, _id: 'c3', name: 'Nueva' })
    expect(next.cards).toHaveLength(3)
    expect(next.cards.at(-1)).toMatchObject({ _id: 'c3', count: 1 })
  })
})
