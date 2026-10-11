export const pullTexts = {
  title: 'Abrir un sobre',
  guaranteedNext: 'Tu próximo sobre trae una mítica garantizada.',
  guaranteedIn: (count: number, formatted: string) =>
    `Mítica garantizada dentro de ${formatted} ${count === 1 ? 'sobre' : 'sobres'}.`,

  open: (cost: string) => `Abrir sobre · ${cost}`,
  openAnother: (cost: string) => `Abrir otro · ${cost}`,
  opening: 'Abriendo…',
  skip: 'Saltar',
  pack: 'Sobre de Smilbot',
  swipeHint: 'También puedes deslizar el dedo por la línea de corte.',

  shortfall: (amount: string) => `Te faltan ${amount} monedas.`,
  claimDailyHint: 'Reclama tu recompensa diaria',

  newBadge: 'Nueva',
  copiesBadge: (copies: string) => `Ya la tenías · ×${copies}`,
  copiesLabel: (copies: string) => `Ya la tenías. Ahora tienes ${copies} copias.`,
  pityBadge: 'Garantizada por piedad',
  rarityLine: (rarity: string, probability: string) => `${rarity} · ${probability}`,
  announce: (name: string, rarity: string) => `Has conseguido ${name} (${rarity}).`,
  announceNew: 'Es nueva en tu colección.',

  smilbot: {
    pityMythic: '¡Tu mítica garantizada! Te la habías ganado.',
    mythic: '¡¿Una mítica?! ¡Miau!',
    legendary: '¡Una legendaria! Esa no se ve todos los días.',
    epic: '¡Una épica! Bien hecho.',
    duplicate: 'Esta ya la tenías.',
  },

  notEnoughCoins: 'No tienes monedas suficientes para abrir un sobre.',
  noCardsForRarity: 'Esa rareza todavía no tiene cartas. No se te ha cobrado nada.',
  pullError: 'No se pudo abrir el sobre. Inténtalo de nuevo.',

  loading: 'Cargando…',
  loadError: 'No se pudo cargar tu saldo.',
  retry: 'Reintentar',
} as const
