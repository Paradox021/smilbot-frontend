import type { DailyClaimResult } from './types'

/** Mismos casos que muestra el bot. Ver `Modelos y Contratos/Economia y Rachas.md`. */
export type ClaimOutcome =
  | { kind: 'newRecord'; streak: number }
  | { kind: 'streakBroken'; lostStreak: number }
  | { kind: 'streakContinues'; streak: number }
  | { kind: 'streakStarted' }

export function getClaimOutcome(result: DailyClaimResult): ClaimOutcome {
  if (result.isNewRecord) return { kind: 'newRecord', streak: result.dailyStreak }
  if (result.dailyStreak === 1 && result.previousStreak >= 2) {
    return { kind: 'streakBroken', lostStreak: result.previousStreak }
  }
  if (result.dailyStreak >= 2) return { kind: 'streakContinues', streak: result.dailyStreak }
  return { kind: 'streakStarted' }
}
