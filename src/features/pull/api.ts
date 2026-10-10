import { http } from '@/shared/lib/http'
import type { PullResult } from './types'

export function pullCard(discordId: string): Promise<PullResult> {
  return http.post<PullResult>(`/user/${encodeURIComponent(discordId)}/card/random`)
}
