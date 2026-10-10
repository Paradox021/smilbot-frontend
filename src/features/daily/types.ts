/** Respuesta de `POST /user/:id/dailyBalance`. Ver `Backend API/Endpoints Usuarios y Stats.md`. */
export interface DailyClaimResult {
  ok: boolean
  balance: number
  dailyStreak: number
  /** Racha guardada antes de este reclamo. */
  previousStreak: number
  maxDailyStreak: number
  previousMaxStreak: number
  isNewRecord: boolean
  totalDailiesClaimed: number
}
