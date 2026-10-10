export const pullTexts = {
  title: 'Abrir un sobre',
  guaranteedNext: 'Tu próximo sobre trae una mítica garantizada.',
  guaranteedIn: (count: number, formatted: string) =>
    `Mítica garantizada dentro de ${formatted} ${count === 1 ? 'sobre' : 'sobres'}.`,

  open: (cost: string) => `Abrir sobre · ${cost}`,
  openAnother: (cost: string) => `Abrir otro · ${cost}`,
  opening: 'Abriendo…',
  skip: 'Saltar',

  shortfall: (amount: string) => `Te faltan ${amount} monedas.`,
  claimDailyHint: 'Reclama tu recompensa diaria',

  newBadge: 'Nueva',
  pityBadge: 'Garantizada por piedad',
  rarityLine: (rarity: string, probability: string) => `${rarity} · ${probability}`,
  announce: (name: string, rarity: string) => `Has conseguido ${name} (${rarity}).`,
  announceNew: 'Es nueva en tu colección.',

  notEnoughCoins: 'No tienes monedas suficientes para abrir un sobre.',
  noCardsForRarity: 'Esa rareza todavía no tiene cartas. No se te ha cobrado nada.',
  pullError: 'No se pudo abrir el sobre. Inténtalo de nuevo.',

  loading: 'Cargando…',
  loadError: 'No se pudo cargar tu saldo.',
  retry: 'Reintentar',
} as const
