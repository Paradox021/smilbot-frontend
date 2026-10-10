import { RARITIES, type Rarity } from '@/shared/config/rarities'
import type { LuckStats, PityStats } from './types'

export function hasLuckData(luck: LuckStats): boolean {
  return luck.totalCards > 0
}

/** Progreso hacia la mítica garantizada, de 0 a 100. */
export function getPityProgress({ pullsSinceLastMythic, pityThreshold }: PityStats): number {
  if (pityThreshold <= 0) return 0
  return Math.min(100, Math.max(0, (pullsSinceLastMythic / pityThreshold) * 100))
}

export function getRarityBreakdown(
  breakdown: LuckStats['breakdown'],
): { rarity: Rarity; count: number }[] {
  return RARITIES.map((rarity) => ({ rarity, count: breakdown[rarity.key] }))
}
