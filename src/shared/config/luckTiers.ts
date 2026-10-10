export type LuckTierCode = 'GODLY' | 'LUCKY' | 'AVERAGE' | 'UNLUCKY' | 'CURSED'

export interface LuckTier {
  code: LuckTierCode
  name: string
  icon: string
}

/** Ordenados de mejor a peor suerte. Fuente: bóveda, `Modelos y Contratos/Sistema de Suerte y Tiers.md`. */
export const LUCK_TIERS: readonly LuckTier[] = [
  { code: 'GODLY', name: 'Suerte divina', icon: '🌟' },
  { code: 'LUCKY', name: 'Afortunado', icon: '🍀' },
  { code: 'AVERAGE', name: 'Normal', icon: '⚖️' },
  { code: 'UNLUCKY', name: 'Desafortunado', icon: '🌧️' },
  { code: 'CURSED', name: 'Maldito', icon: '💀' },
]

export function getLuckTier(code: string): LuckTier | undefined {
  return LUCK_TIERS.find((tier) => tier.code === code)
}
