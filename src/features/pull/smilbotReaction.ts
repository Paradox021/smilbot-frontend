import { getRarity } from '@/shared/config/rarities'
import type { PullOutcome } from './types'

export type SmilbotReaction = 'pityMythic' | 'mythic' | 'legendary' | 'epic' | 'duplicate'

/** Smilbot solo reacciona a Épica o mejor, y sin emoción a las repetidas. */
export function getSmilbotReaction({ result, isNew }: PullOutcome): SmilbotReaction | null {
  const rarity = getRarity(result.type)?.key
  if (rarity === 'mythic') return result.isPity ? 'pityMythic' : 'mythic'
  if (rarity === 'legendary' || rarity === 'epic') return rarity
  if (isNew === false) return 'duplicate'
  return null
}
