import { RARITIES } from '@/shared/config/rarities'
import { getGlowKeyframes, getRevealTiming, getVibrationPattern, PACK_OPEN_MS } from './reveal'

const totalMs = (type: number) => {
  const timing = getRevealTiming(type)
  return timing.anticipationMs + timing.flipMs
}

describe('getRevealTiming', () => {
  it('la ceremonia dura más cuanto más rara es la carta', () => {
    const durations = RARITIES.map((rarity) => totalMs(rarity.type))
    expect(durations).toEqual([...durations].sort((a, b) => a - b))
    expect(new Set(durations).size).toBe(RARITIES.length)
  })

  it('una común gira directamente y sin efectos', () => {
    expect(getRevealTiming(0)).toMatchObject({
      anticipationMs: 0,
      pulses: 0,
      flash: false,
      rays: false,
    })
  })

  it('solo la mítica tiñe la pantalla y lleva partículas y brillo holográfico', () => {
    for (const rarity of RARITIES) {
      const timing = getRevealTiming(rarity.type)
      const isMythic = rarity.key === 'mythic'
      expect(timing.tint).toBe(isMythic)
      expect(timing.particles).toBe(isMythic)
      expect(timing.holo).toBe(isMythic)
    }
  })

  it('una rareza desconocida se trata como común', () => {
    expect(getRevealTiming(99)).toEqual(getRevealTiming(0))
  })

  it('ninguna ceremonia, con la apertura del sobre, pasa de 3,5 segundos', () => {
    for (const rarity of RARITIES) {
      expect(totalMs(rarity.type) + PACK_OPEN_MS).toBeLessThanOrEqual(3500)
    }
  })
})

describe('getGlowKeyframes', () => {
  it('sin pulsos no hay brillo', () => {
    expect(getGlowKeyframes(0)).toEqual([0])
  })

  it('cada pulso es más fuerte que el anterior y termina encendido', () => {
    const keyframes = getGlowKeyframes(3)
    expect(keyframes).toHaveLength(7)
    const peaks = [keyframes[1], keyframes[3], keyframes[5]]
    expect(peaks).toEqual([...peaks].sort())
    expect(keyframes.at(-1)).toBe(0.7)
  })
})

describe('getVibrationPattern', () => {
  it('solo vibra de Épica en adelante, y más cuanto más rara', () => {
    expect(getVibrationPattern(0)).toBeNull()
    expect(getVibrationPattern(1)).toBeNull()
    const total = (type: number) => (getVibrationPattern(type) ?? []).reduce((a, b) => a + b, 0)
    expect(total(2)).toBeGreaterThan(0)
    expect(total(3)).toBeGreaterThan(total(2))
    expect(total(4)).toBeGreaterThan(total(3))
  })
})
