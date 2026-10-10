export const profileTexts = {
  title: 'Mi perfil',
  admin: 'Admin',
  discordId: 'ID de Discord',
  memberSince: 'Miembro desde',
  balance: 'Saldo',
  dailyStreak: 'Racha diaria',
  maxDailyStreak: 'Mejor racha',
  totalDailiesClaimed: 'Recompensas diarias',
  cardsOpenedCount: 'Sobres abiertos',
  coins: (amount: string) => `${amount} monedas`,
  days: (count: string) => `${count} días`,
} as const
