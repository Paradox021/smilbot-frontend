export const statsTexts = {
  balance: 'Saldo',
  earned: (amount: string) => `+${amount}`,
  spent: (amount: string) => `−${amount}`,
} as const
