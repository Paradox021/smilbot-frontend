import { getLuckTier, LUCK_TIERS } from './luckTiers'

describe('luckTiers', () => {
  it('define los cinco tiers de la bóveda', () => {
    expect(LUCK_TIERS.map((tier) => tier.code)).toEqual([
      'GODLY',
      'LUCKY',
      'AVERAGE',
      'UNLUCKY',
      'CURSED',
    ])
  })

  it('obtiene un tier por su código', () => {
    expect(getLuckTier('LUCKY')).toMatchObject({ name: 'Afortunado' })
    expect(getLuckTier('DESCONOCIDO')).toBeUndefined()
  })
})
