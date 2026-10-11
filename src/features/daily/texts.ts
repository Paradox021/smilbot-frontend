export const dailyTexts = {
  title: 'Recompensa diaria',
  coins: 'monedas',
  keepStreak: (days: string) => `Reclámala para llevar tu racha a ${days} días.`,
  streakAtRisk: (days: string, when: string) => `Tu racha de ${days} días caduca ${when}.`,
  claim: 'Reclamar',
  claiming: 'Reclamando…',
  nextIn: 'Próxima recompensa en',

  reward: (amount: string) => `+${amount} monedas`,
  newRecord: (days: string) => `Nuevo récord: ${days} días seguidos.`,
  streakBroken: (days: string) => `Perdiste tu racha de ${days} días. Empiezas de nuevo.`,
  streakContinues: (days: string) => `Racha de ${days} días.`,
  streakStarted: 'Primer día de racha.',

  cooldownError: 'Todavía no puedes reclamar la recompensa.',
  claimError: 'No se pudo reclamar la recompensa. Inténtalo de nuevo.',
} as const
