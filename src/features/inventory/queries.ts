import { useQuery } from '@tanstack/react-query'
import { fetchInventory } from './api'

export const inventoryKeys = {
  all: ['inventory'] as const,
  user: (discordId: string) => [...inventoryKeys.all, 'user', discordId] as const,
}

export function useInventory(discordId: string) {
  return useQuery({
    queryKey: inventoryKeys.user(discordId),
    queryFn: ({ signal }) => fetchInventory(discordId, signal),
  })
}
