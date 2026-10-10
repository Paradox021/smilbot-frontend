import type { CurrentUser } from '@/features/auth'
import type { UserStats } from '@/features/profile'

export const currentUserFixture: CurrentUser = {
  discordId: '123456789012345678',
  username: 'Gamer123',
  isAdmin: false,
}

/** Ejemplo de `GET /user/:id/stats` tomado de la bóveda (`Endpoints Usuarios y Stats.md`). */
export const userStatsFixture: UserStats = {
  discordId: '123456789012345678',
  username: 'Gamer123',
  balance: 1650,
  dailyStreak: 11,
  maxDailyStreak: 15,
  previousMaxStreak: 10,
  totalDailiesClaimed: 42,
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
