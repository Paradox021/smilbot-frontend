import { getRarity, type RarityKey } from '@/shared/config/rarities'

/** Ceremonia del revelado: crece con la rareza. Ver "Escalado por rareza" en `Frontend/Plan Frontend.md`. */
export interface RevealTiming {
  /** Brillo del dorso antes de girar; `0` = gira directamente. */
  anticipationMs: number
  flipMs: number
  /** Pulsos de brillo durante la anticipación. */
  pulses: number
  flash: boolean
  rays: boolean
  particles: boolean
  /** El fondo de la pantalla se tiñe del color de la rareza. */
  tint: boolean
  /** Brillo holográfico sobre la carta revelada. */
  holo: boolean
}

const REVEAL_BY_RARITY: Record<RarityKey, RevealTiming> = {
  common: {
    anticipationMs: 0,
    flipMs: 600,
    pulses: 0,
    flash: false,
    rays: false,
    particles: false,
    tint: false,
    holo: false,
  },
  rare: {
    anticipationMs: 500,
    flipMs: 600,
    pulses: 1,
    flash: false,
    rays: false,
    particles: false,
    tint: false,
    holo: false,
  },
  epic: {
    anticipationMs: 900,
    flipMs: 650,
    pulses: 1,
    flash: true,
    rays: false,
    particles: false,
    tint: false,
    holo: false,
  },
  legendary: {
    anticipationMs: 1400,
    flipMs: 700,
    pulses: 2,
    flash: true,
    rays: true,
    particles: false,
    tint: false,
    holo: false,
  },
  mythic: {
    anticipationMs: 2100,
    flipMs: 800,
    pulses: 3,
    flash: true,
    rays: true,
    particles: true,
    tint: true,
    holo: true,
  },
}

/** La solapa del sobre se rasga: se suma a la ceremonia de cualquier rareza. */
export const PACK_OPEN_MS = 400

const VIBRATION_BY_RARITY: Partial<Record<RarityKey, number[]>> = {
  epic: [40],
  legendary: [60, 40, 90],
  mythic: [80, 50, 80, 50, 160],
}

/** Vibración al revelar (solo Épica o mejor); `null` si no vibra. */
export function getVibrationPattern(rarityType: number): number[] | null {
  return VIBRATION_BY_RARITY[getRarity(rarityType)?.key ?? 'common'] ?? null
}

export function getRevealTiming(rarityType: number): RevealTiming {
  return REVEAL_BY_RARITY[getRarity(rarityType)?.key ?? 'common']
}

/** Opacidad del brillo: sube y baja en cada pulso, cada vez más fuerte, y se queda encendido. */
export function getGlowKeyframes(pulses: number): number[] {
  if (pulses <= 0) return [0]
  const keyframes = [0]
  for (let pulse = 1; pulse <= pulses; pulse++) {
    const peak = 0.5 + (0.5 * pulse) / pulses
    keyframes.push(peak, pulse === pulses ? 0.7 : 0.25)
  }
  return keyframes
}
