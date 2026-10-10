import { http } from '@/shared/lib/http'
import type { DailyClaimResult } from './types'

export function claimDaily(discordId: string): Promise<DailyClaimResult> {
  return http.post<DailyClaimResult>(`/user/${encodeURIComponent(discordId)}/dailyBalance`)
}
