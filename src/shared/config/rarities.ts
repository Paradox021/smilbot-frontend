export type RarityType = 0 | 1 | 2 | 3 | 4

export interface Rarity {
  type: RarityType
  key: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic'
  name: string
  color: string
  probability: number
}

/** Ordenadas de menor a mayor rareza. Fuente: bóveda, `Modelos y Contratos/Cartas y Rarezas.md`. */
export const RARITIES: readonly Rarity[] = [
  { type: 0, key: 'common', name: 'Común', color: '#808080', probability: 0.575 },
  { type: 1, key: 'rare', name: 'Rara', color: '#0070dd', probability: 0.3 },
  { type: 2, key: 'epic', name: 'Épica', color: '#a335ee', probability: 0.1 },
  { type: 3, key: 'legendary', name: 'Legendaria', color: '#ff8000', probability: 0.02 },
  { type: 4, key: 'mythic', name: 'Mítica', color: '#c45039', probability: 0.005 },
]

export function isRarityType(value: number): value is RarityType {
  return RARITIES.some((rarity) => rarity.type === value)
}

export function getRarity(type: number): Rarity | undefined {
  return RARITIES.find((rarity) => rarity.type === type)
}
