import { userStatsFixture } from '@/test/fixtures'
import { getPityProgress, getRarityBreakdown, hasLuckData } from './stats'

const { luck, pity } = userStatsFixture

describe('stats', () => {
  it('detecta si hay datos de suerte', () => {
    expect(hasLuckData(luck)).toBe(true)
    expect(hasLuckData({ ...luck, totalCards: 0 })).toBe(false)
  })

  it('calcula el progreso de pity entre 0 y 100', () => {
    expect(getPityProgress(pity)).toBeCloseTo(97.6)
    expect(getPityProgress({ ...pity, pullsSinceLastMythic: 300 })).toBe(100)
    expect(getPityProgress({ ...pity, pityThreshold: 0 })).toBe(0)
  })

  it('ordena el desglose por rareza usando la configuración compartida', () => {
    expect(
      getRarityBreakdown(luck.breakdown).map(({ rarity, count }) => [rarity.key, count]),
    ).toEqual([
      ['common', 18],
      ['rare', 11],
      ['epic', 4],
      ['legendary', 2],
      ['mythic', 0],
    ])
  })
})
