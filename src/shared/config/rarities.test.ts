import { getRarity, isRarityType, RARITIES } from './rarities'

describe('rarities', () => {
  it('define las cinco rarezas ordenadas por type', () => {
    expect(RARITIES.map((rarity) => rarity.type)).toEqual([0, 1, 2, 3, 4])
  })

  it('las probabilidades suman 100 %', () => {
    const total = RARITIES.reduce((sum, rarity) => sum + rarity.probability, 0)
    expect(total).toBeCloseTo(1)
  })

  it('obtiene una rareza por su type', () => {
    expect(getRarity(4)).toMatchObject({ key: 'mythic', color: '#c45039' })
    expect(getRarity(9)).toBeUndefined()
  })

  it('valida si un número es un type de rareza', () => {
    expect(isRarityType(2)).toBe(true)
    expect(isRarityType(5)).toBe(false)
  })
})
