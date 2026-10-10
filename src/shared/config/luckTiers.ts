import { CloudRain, Clover, Scale, Skull, Sparkles, type LucideIcon } from 'lucide-react'

export type LuckTierCode = 'GODLY' | 'LUCKY' | 'AVERAGE' | 'UNLUCKY' | 'CURSED'

export interface LuckTier {
  code: LuckTierCode
  name: string
  icon: LucideIcon
}

/** Ordenados de mejor a peor suerte. Fuente: bóveda, `Modelos y Contratos/Sistema de Suerte y Tiers.md`. */
export const LUCK_TIERS: readonly LuckTier[] = [
  { code: 'GODLY', name: 'Suerte divina', icon: Sparkles },
  { code: 'LUCKY', name: 'Afortunado', icon: Clover },
  { code: 'AVERAGE', name: 'Normal', icon: Scale },
  { code: 'UNLUCKY', name: 'Desafortunado', icon: CloudRain },
  { code: 'CURSED', name: 'Maldito', icon: Skull },
]

export function getLuckTier(code: string): LuckTier | undefined {
  return LUCK_TIERS.find((tier) => tier.code === code)
}
