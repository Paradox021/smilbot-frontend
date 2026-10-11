import { addCardToInventory, countCopies } from './inventory'
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

describe('countCopies', () => {
  it('cuenta las copias de una carta', () => {
    expect(countCopies(inventory, 'c1')).toBe(2)
  })

  it('0 si no está o tiene count 0', () => {
    expect(countCopies(inventory, 'c2')).toBe(0)
    expect(countCopies(inventory, 'c3')).toBe(0)
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
