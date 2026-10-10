import type { UserStats } from '@/features/stats'

/** Con menos de este margen hasta que caduque la racha, se avisa de que está en peligro. */
export const STREAK_RISK_WINDOW_MS = 6 * 3_600_000

export type DailyStatus =
  | { kind: 'cooldown'; availableAt: Date }
  | {
      kind: 'available'
      /** Racha actual (`0` si no hay ninguna viva). */
      streak: number
      /** Cuándo se rompe la racha si no se reclama; `null` si no hay racha. */
      streakExpiresAt: Date | null
      streakAtRisk: boolean
    }

type DailyStats = Pick<UserStats, 'dailyStreak' | 'nextDailyAt' | 'streakExpiresAt'>

export function getDailyStatus(stats: DailyStats, now: Date): DailyStatus {
  const availableAt = new Date(stats.nextDailyAt)
  if (availableAt > now) return { kind: 'cooldown', availableAt }

  const streakExpiresAt =
    stats.dailyStreak > 0 && stats.streakExpiresAt ? new Date(stats.streakExpiresAt) : null
  const streakAtRisk =
    streakExpiresAt !== null && streakExpiresAt.getTime() - now.getTime() < STREAK_RISK_WINDOW_MS

  return {
    kind: 'available',
    streak: streakExpiresAt ? stats.dailyStreak : 0,
    streakExpiresAt,
    streakAtRisk,
  }
}
