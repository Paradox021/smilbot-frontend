import { getClaimOutcome } from './claimOutcome'
import type { DailyClaimResult } from './types'

const base: DailyClaimResult = {
  ok: true,
  balance: 650,
  dailyStreak: 7,
  previousStreak: 6,
  maxDailyStreak: 14,
  previousMaxStreak: 14,
  isNewRecord: false,
  totalDailiesClaimed: 42,
}

describe('getClaimOutcome', () => {
  it('nuevo récord', () => {
    expect(getClaimOutcome({ ...base, dailyStreak: 15, isNewRecord: true })).toEqual({
      kind: 'newRecord',
      streak: 15,
    })
  })

  it('racha rota', () => {
    expect(getClaimOutcome({ ...base, dailyStreak: 1, previousStreak: 9 })).toEqual({
      kind: 'streakBroken',
      lostStreak: 9,
    })
  })

  it('racha que continúa', () => {
    expect(getClaimOutcome(base)).toEqual({ kind: 'streakContinues', streak: 7 })
  })

  it('primer día de racha', () => {
    expect(getClaimOutcome({ ...base, dailyStreak: 1, previousStreak: 0 })).toEqual({
      kind: 'streakStarted',
    })
    expect(getClaimOutcome({ ...base, dailyStreak: 1, previousStreak: 1 })).toEqual({
      kind: 'streakStarted',
    })
  })
})
