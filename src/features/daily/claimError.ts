import { isApiError } from '@/shared/lib/http'
import { dailyTexts as t } from './texts'

/** `400`: el backend aún no deja reclamar (cooldown). */
export function getClaimErrorText(error: unknown): string {
  return isApiError(error) && error.status === 400 ? t.cooldownError : t.claimError
}
