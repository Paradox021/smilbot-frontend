import { getDailyStatus } from './dailyStatus'

const now = new Date('2025-06-01T12:00:00.000Z')
const inHours = (hours: number) => new Date(now.getTime() + hours * 3_600_000).toISOString()

describe('getDailyStatus', () => {
  it('en cooldown si nextDailyAt aún no ha llegado', () => {
    const status = getDailyStatus(
      { dailyStreak: 4, nextDailyAt: inHours(5), streakExpiresAt: inHours(30) },
      now,
    )
    expect(status).toEqual({ kind: 'cooldown', availableAt: new Date(inHours(5)) })
  })

  it('disponible con racha viva y sin peligro', () => {
    const status = getDailyStatus(
      { dailyStreak: 4, nextDailyAt: inHours(-1), streakExpiresAt: inHours(24) },
      now,
    )
    expect(status).toMatchObject({ kind: 'available', streak: 4, streakAtRisk: false })
  })

  it('avisa si la racha caduca en menos de 6 horas', () => {
    const status = getDailyStatus(
      { dailyStreak: 4, nextDailyAt: inHours(-20), streakExpiresAt: inHours(5.5) },
      now,
    )
    expect(status).toMatchObject({ kind: 'available', streak: 4, streakAtRisk: true })
  })

  it('sin racha activa no hay nada que perder', () => {
    const status = getDailyStatus(
      { dailyStreak: 0, nextDailyAt: inHours(-30), streakExpiresAt: null },
      now,
    )
    expect(status).toEqual({
      kind: 'available',
      streak: 0,
      streakExpiresAt: null,
      streakAtRisk: false,
    })
  })
})
