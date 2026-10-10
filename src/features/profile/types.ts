import type { RarityKey } from '@/shared/config/rarities'

/** Respuesta de `GET /user/:id/stats`. Ver `Backend API/Endpoints Usuarios y Stats.md`. */
export interface UserStats {
  discordId: string
  username: string
  /** Avatar de Discord (o el avatar por defecto de Discord); siempre presente. */
  avatarUrl: string
  balance: number
  dailyStreak: number
  maxDailyStreak: number
  previousMaxStreak: number
  totalDailiesClaimed: number
  totalCoinsEarned: number
  totalCoinsSpent: number
  cardsCount: number
  cardsOpenedCount: number
  marketSalesCount: number
  pity: PityStats
  luck: LuckStats
}

export interface PityStats {
  pullsSinceLastMythic: number
  pityThreshold: number
  pullsUntilGuaranteed: number
  pityMythicsCount: number
}

export interface LuckStats {
  totalCards: number
  luckPercentage: number
  luckDelta: string
  tier: string
  tierCode: string
  pityMythicsCount: number
  eligibleForLeaderboard: boolean
  breakdown: Record<RarityKey, number> & { pityMythics: number }
}
