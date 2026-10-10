import { isApiError } from '@/shared/lib/http'
import { pullTexts as t } from './texts'

/** `400`: saldo insuficiente. `404`: la rareza obtenida no tiene cartas (no se cobra). */
export function getPullErrorText(error: unknown): string {
  if (isApiError(error) && error.status === 400) return t.notEnoughCoins
  if (isApiError(error) && error.status === 404) return t.noCardsForRarity
  return t.pullError
}
