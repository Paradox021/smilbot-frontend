export const dailyTexts = {
  title: 'Recompensa diaria',
  available: (amount: string) => `Ya puedes reclamar tus ${amount} monedas de hoy.`,
  keepStreak: (days: string) => `Reclámala para llevar tu racha a ${days} días.`,
  streakAtRisk: (days: string, when: string) => `Tu racha de ${days} días caduca ${when}.`,
  claim: (amount: string) => `Reclamar ${amount} monedas`,
  claiming: 'Reclamando…',
  nextIn: 'Siguiente recompensa en',

  reward: (amount: string) => `+${amount} monedas`,
  newRecord: (days: string) => `Nuevo récord: ${days} días seguidos.`,
  streakBroken: (days: string) => `Perdiste tu racha de ${days} días. Empiezas de nuevo.`,
  streakContinues: (days: string) => `Racha de ${days} días.`,
  streakStarted: 'Primer día de racha.',

  cooldownError: 'Todavía no puedes reclamar la recompensa.',
  claimError: 'No se pudo reclamar la recompensa. Inténtalo de nuevo.',
} as const
