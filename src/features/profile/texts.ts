export const profileTexts = {
  admin: 'Admin',
  discordId: 'ID de Discord',
  loadingStats: 'Cargando estadísticas…',
  statsError: 'No se pudieron cargar tus estadísticas.',
  retry: 'Reintentar',

  economyTitle: 'Economía',
  balance: 'Saldo',
  totalCoinsEarned: 'Ganado en total',
  totalCoinsSpent: 'Gastado en total',
  marketSalesCount: 'Ventas en el mercado',

  streakTitle: 'Rachas',
  dailyStreak: 'Racha actual',
  maxDailyStreak: 'Mejor racha',
  totalDailiesClaimed: 'Recompensas diarias',

  collectionTitle: 'Colección',
  cardsCount: 'Cartas en inventario',
  cardsOpenedCount: 'Sobres abiertos',

  luckTitle: 'Suerte en el gacha',
  luckEmpty: 'Aún no has abierto ningún sobre. Tu suerte aparecerá aquí cuando lo hagas.',
  luckPercentage: 'Suerte',
  luckDelta: 'Respecto a la media',
  evaluatedCards: 'Cartas evaluadas',
  eligibleForLeaderboard: 'Apareces en el ranking de suerte.',
  notEligibleForLeaderboard: 'Necesitas más aperturas para entrar en el ranking de suerte.',
  breakdownTitle: 'Cartas evaluadas por rareza',
  pityMythics: (count: string) => `Míticas por pity (no cuentan para la suerte): ${count}`,

  pityTitle: 'Pity',
  pityProgressLabel: 'Progreso hacia la mítica garantizada',
  pityProgress: (current: string, threshold: string) => `${current} / ${threshold} tiradas`,
  pullsUntilGuaranteed: (count: string) => `Mítica garantizada en ${count} tiradas`,
  pityMythicsCount: 'Míticas obtenidas por pity',

  coins: (amount: string) => `${amount} monedas`,
  days: (count: string) => `${count} días`,
} as const
