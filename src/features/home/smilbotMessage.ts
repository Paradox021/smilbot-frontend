import type { DailyStatus } from '@/features/daily'
import type { UserStats } from '@/features/stats'

/** Con estos sobres o menos para la mítica garantizada, Smilbot avisa. */
export const PITY_CLOSE_PULLS = 10

const DAY_MS = 86_400_000

export type SmilbotMessage =
  | { kind: 'streakAtRisk'; streak: number; expiresAt: Date }
  | { kind: 'dailyReady' }
  | { kind: 'pityClose'; remaining: number }
  | { kind: 'firstPack' }
  /** Saludo que cambia cada día; `index` va de `0` a `greetingCount - 1`. */
  | { kind: 'greeting'; index: number }

type MessageStats = Pick<UserStats, 'cardsCount' | 'pity'>

/** Un solo mensaje, el más importante para el usuario ahora mismo. Ver la fase 2 del rediseño. */
export function getSmilbotMessage(
  stats: MessageStats,
  daily: DailyStatus,
  now: Date,
  greetingCount: number,
): SmilbotMessage {
  if (daily.kind === 'available' && daily.streakAtRisk && daily.streakExpiresAt) {
    return { kind: 'streakAtRisk', streak: daily.streak, expiresAt: daily.streakExpiresAt }
  }
  if (daily.kind === 'available') return { kind: 'dailyReady' }
  if (stats.pity.pullsUntilGuaranteed <= PITY_CLOSE_PULLS) {
    return { kind: 'pityClose', remaining: stats.pity.pullsUntilGuaranteed }
  }
  if (stats.cardsCount === 0) return { kind: 'firstPack' }
  const day = Math.floor(now.getTime() / DAY_MS)
  return { kind: 'greeting', index: greetingCount > 0 ? day % greetingCount : 0 }
}
