export const STREAK_WEEK_DAYS = 7

export interface StreakWeek {
  /** Semana de la racha en la que cae hoy (desde 1). */
  week: number
  /** Huellas rellenas de esta semana. */
  filled: number
  /** Posición de hoy en la tira (0-6): rellena si ya se reclamó, por rellenar si no. */
  todayIndex: number
}

/**
 * Tira de 7 huellas de la racha. `streak` es la racha efectiva (`0` si se rompió) y `claimedToday`
 * indica si el daily de hoy ya está reclamado (el siguiente está en cooldown).
 */
export function getStreakWeek(streak: number, claimedToday: boolean): StreakWeek {
  const days = Math.max(0, streak)
  const todayPosition = claimedToday && days > 0 ? days - 1 : days
  const week = Math.floor(todayPosition / STREAK_WEEK_DAYS) + 1
  return {
    week,
    filled: days - (week - 1) * STREAK_WEEK_DAYS,
    todayIndex: todayPosition % STREAK_WEEK_DAYS,
  }
}
