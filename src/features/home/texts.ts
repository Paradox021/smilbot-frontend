export const homeTexts = {
  greeting: (username: string) => `Hola, ${username}`,
  loading: 'Cargando tu inicio…',
  loadError: 'No se pudo cargar tu inicio.',
  retry: 'Reintentar',

  streakTitle: 'Racha',
  streakDays: (days: string) => `${days} días`,
  streakNone: 'Sin racha activa. Reclama la recompensa diaria para empezar una.',
  streakRecord: (days: string) => `Récord: ${days} días`,
  dailiesClaimed: (count: string) => `${count} recompensas reclamadas`,

  pityTitle: 'Mítica garantizada',
  pullsUntilGuaranteed: (count: string) => `Dentro de ${count} sobres`,
  pityProgressLabel: 'Progreso hacia la mítica garantizada',
  pityProgress: (current: string, threshold: string) =>
    `${current} de ${threshold} sobres sin mítica`,

  allStats: 'Ver todas tus estadísticas',
} as const
