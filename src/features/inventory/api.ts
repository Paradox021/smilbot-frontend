import { http } from '@/shared/lib/http'
import type { Inventory } from './types'

export function fetchInventory(discordId: string, signal?: AbortSignal): Promise<Inventory> {
  return http.get<Inventory>(`/user/${encodeURIComponent(discordId)}/cards`, { signal })
}
