import type { DailyStatus } from '@/features/daily'
import { userStatsFixture } from '@/test/fixtures'
import { getSmilbotMessage } from './smilbotMessage'

const now = new Date('2025-06-01T12:00:00.000Z')
const expiresAt = new Date('2025-06-01T15:00:00.000Z')
const cooldown: DailyStatus = { kind: 'cooldown', availableAt: expiresAt }
const available: DailyStatus = {
  kind: 'available',
  streak: 11,
  streakExpiresAt: expiresAt,
  streakAtRisk: false,
}
const farFromPity = { ...userStatsFixture.pity, pullsUntilGuaranteed: 120 }
const stats = { cardsCount: 35, pity: farFromPity }

describe('getSmilbotMessage', () => {
  it('lo primero es la racha en peligro', () => {
    expect(getSmilbotMessage(stats, { ...available, streakAtRisk: true }, now, 3)).toEqual({
      kind: 'streakAtRisk',
      streak: 11,
      expiresAt,
    })
  })

  it('después, el daily disponible', () => {
    expect(getSmilbotMessage(stats, available, now, 3)).toEqual({ kind: 'dailyReady' })
  })

  it('después, la mítica garantizada cerca', () => {
    const pity = { ...farFromPity, pullsUntilGuaranteed: 6 }
    expect(getSmilbotMessage({ ...stats, pity }, cooldown, now, 3)).toEqual({
      kind: 'pityClose',
      remaining: 6,
    })
  })

  it('sin cartas invita a abrir el primer sobre', () => {
    expect(getSmilbotMessage({ ...stats, cardsCount: 0 }, cooldown, now, 3)).toEqual({
      kind: 'firstPack',
    })
  })

  it('si no, un saludo que cambia cada día', () => {
    const today = getSmilbotMessage(stats, cooldown, now, 3)
    const tomorrow = getSmilbotMessage(stats, cooldown, new Date(now.getTime() + 86_400_000), 3)
    expect(today.kind).toBe('greeting')
    expect(tomorrow).not.toEqual(today)
    expect(getSmilbotMessage(stats, cooldown, now, 3)).toEqual(today)
  })
})
