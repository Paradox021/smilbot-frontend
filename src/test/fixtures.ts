import type { CurrentUser } from '@/features/auth'

export const currentUserFixture: CurrentUser = {
  _id: '66bcde1234567890abcdef12',
  discordId: '123456789012345678',
  username: 'Gamer123',
  balance: 1650,
  cards: [{ cardId: '66bcde1234567890abcdef99', count: 2 }],
  lastDaily: '2026-10-09T10:00:00.000Z',
  dailyStreak: 11,
  maxDailyStreak: 15,
  previousMaxStreak: 10,
  totalDailiesClaimed: 42,
  totalCoinsEarned: 5400,
  totalCoinsSpent: 4750,
  cardsOpenedCount: 30,
  pityCount: 12,
  pityMythicsCount: 0,
  createdAt: '2026-01-15T12:00:00.000Z',
  updatedAt: '2026-10-09T10:00:00.000Z',
  isAdmin: false,
}
