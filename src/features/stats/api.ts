import { http } from '@/shared/lib/http'
import type { UserStats } from './types'

export function fetchUserStats(discordId: string, signal?: AbortSignal): Promise<UserStats> {
  return http.get<UserStats>(`/user/${encodeURIComponent(discordId)}/stats`, { signal })
}
