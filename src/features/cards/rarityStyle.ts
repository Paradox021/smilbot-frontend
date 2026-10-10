import type { CSSProperties } from 'react'
import { getRarity } from '@/shared/config/rarities'

const FALLBACK_COLOR = '#808080'

export function getRarityColor(type: number): string {
  return getRarity(type)?.color ?? FALLBACK_COLOR
}

export function getRarityName(type: number): string {
  return getRarity(type)?.name ?? ''
}

/** Expone el color de la rareza como `--rarity` para usarlo en clases (`border-(--rarity)`). */
export function rarityStyle(type: number): CSSProperties {
  return { '--rarity': getRarityColor(type) } as CSSProperties
}
