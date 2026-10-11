export const homeTexts = {
  greeting: (username: string) => `Hola, ${username}`,
  loading: 'Cargando tu inicio…',
  loadError: 'Smilbot no ha podido cargar tu inicio.',
  retry: 'Reintentar',

  packTitle: 'Abrir un sobre',
  packPitch: 'Cada sobre trae un gatito. ¿Cuál te tocará?',
  openPack: (cost: string) => `Abrir sobre · ${cost}`,

  streakTitle: 'Racha',
  streakWeek: (week: string) => `Semana ${week}`,
  streakDays: (count: number, formatted: string) => (count === 1 ? '1 día' : `${formatted} días`),
  streakNone: 'Sin racha activa. Reclama la recompensa diaria para empezar una.',
  streakPaws: (filled: number) => `${filled} de 7 días de esta semana`,
  streakRecord: (days: string) => `Récord: ${days} días`,
  dailiesClaimed: (count: string) => `${count} recompensas reclamadas`,

  pityTitle: 'Mítica garantizada',
  pullsUntilGuaranteed: (count: number, formatted: string) =>
    count === 1 ? '1 sobre' : `${formatted} sobres`,
  pityNext: '¡El próximo!',
  pityProgressLabel: 'Progreso hacia la mítica garantizada',
  pityProgress: (current: string, threshold: string) =>
    `${current} de ${threshold} sobres sin mítica`,
  openPackSecondary: (cost: string) => `Abrir un sobre · ${cost}`,

  allStats: 'Ver todas tus estadísticas',

  smilbot: {
    streakAtRisk: (days: string, when: string) =>
      `¡Tu racha de ${days} días caduca ${when}! Reclama tu recompensa para no perderla.`,
    dailyReady: (amount: string) =>
      `Tu recompensa diaria está lista. ¡${amount} monedas te esperan!`,
    pityNext: 'Tu próximo sobre trae una mítica garantizada. ¡Miau!',
    pityClose: (count: number, formatted: string) =>
      count === 1
        ? 'Solo te queda 1 sobre para la mítica garantizada.'
        : `Solo te quedan ${formatted} sobres para la mítica garantizada.`,
    firstPack: '¡Abre tu primer sobre y empieza tu colección!',
    greetings: [
      (username: string) => `¡Hola de nuevo, ${username}! ¿Probamos suerte hoy?`,
      () => 'Hoy huele a carta legendaria… ¿o eran sardinas?',
      () => 'Los gatitos de los sobres no se van a coleccionar solos.',
      () => 'Cada sobre que abres te acerca a la mítica garantizada.',
      () => 'Miau. En gatuno eso significa «abre un sobre».',
    ],
  },
} as const
