import type { CurrentUser } from '@/features/auth'
import type { UserStats } from '@/features/stats'

export const currentUserFixture: CurrentUser = {
  discordId: '123456789012345678',
  username: 'Gamer123',
  isAdmin: false,
  avatarUrl: 'https://cdn.discordapp.com/embed/avatars/0.png',
}

/** Ejemplo de `GET /user/:id/stats` tomado de la bóveda (`Endpoints Usuarios y Stats.md`). */
export const userStatsFixture: UserStats = {
  discordId: '123456789012345678',
  username: 'Gamer123',
  avatarUrl: 'https://cdn.discordapp.com/embed/avatars/0.png',
  createdAt: '2025-03-12T12:00:00.000Z',
  balance: 1650,
  dailyStreak: 11,
  maxDailyStreak: 15,
  previousMaxStreak: 10,
  totalDailiesClaimed: 42,
  lastDaily: '2025-06-01T12:00:00.000Z',
  nextDailyAt: '2025-06-02T12:00:00.000Z',
  streakExpiresAt: '2025-06-03T12:00:00.000Z',
  totalCoinsEarned: 5400,
  totalCoinsSpent: 4750,
  cardsCount: 35,
  cardsOpenedCount: 30,
  marketSalesCount: 5,
  pity: {
    pullsSinceLastMythic: 244,
    pityThreshold: 250,
    pullsUntilGuaranteed: 6,
    pityMythicsCount: 1,
  },
  luck: {
    totalCards: 35,
    luckPercentage: 138.5,
    luckDelta: '+38.5%',
    tier: 'Lucky',
    tierCode: 'LUCKY',
    pityMythicsCount: 1,
    eligibleForLeaderboard: true,
    breakdown: { common: 18, rare: 11, epic: 4, legendary: 2, mythic: 0, pityMythics: 1 },
  },
}
