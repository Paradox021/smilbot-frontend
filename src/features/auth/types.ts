/**
 * Respuesta de `GET /auth/me`: el `User` de la bóveda (sin `tokenVersion`) más `isAdmin`.
 * Ver `Backend API/Autenticacion.md` y `Backend API/Endpoints Usuarios y Stats.md`.
 */
export interface CurrentUser {
  _id: string
  discordId: string
  username: string
  balance: number
  cards: { cardId: string; count: number }[]
  lastDaily?: string
  dailyStreak: number
  maxDailyStreak: number
  previousMaxStreak: number
  totalDailiesClaimed: number
  totalCoinsEarned: number
  totalCoinsSpent: number
  cardsOpenedCount: number
  pityCount: number
  pityMythicsCount: number
  createdAt: string
  updatedAt: string
  isAdmin: boolean
}

export type LoginResult = 'success' | 'error'
