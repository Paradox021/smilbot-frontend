import type { RarityKey } from '@/shared/config/rarities'

/** Respuesta de `GET /user/:id/stats`. Ver `Backend API/Endpoints Usuarios y Stats.md`. */
export interface UserStats {
  discordId: string
  username: string
  /** Avatar de Discord (o el avatar por defecto de Discord); siempre presente. */
  avatarUrl: string
  /** Fecha de registro (ISO); `null` en usuarios antiguos sin el dato. */
  createdAt: string | null
  balance: number
  /** Racha efectiva: `0` si ya se ha roto. */
  dailyStreak: number
  maxDailyStreak: number
  previousMaxStreak: number
  totalDailiesClaimed: number
  /** Último daily reclamado (ISO). */
  lastDaily: string
  /** Cuándo se puede reclamar el siguiente daily (ISO); si ya pasó, está disponible. */
  nextDailyAt: string
  /** Cuándo se rompe la racha actual (ISO); `null` si no hay racha activa. */
  streakExpiresAt: string | null
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
