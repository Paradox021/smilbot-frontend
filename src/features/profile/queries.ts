import { useQuery } from '@tanstack/react-query'
import { fetchUserStats } from './api'

export const profileKeys = {
  all: ['profile'] as const,
  stats: (discordId: string) => [...profileKeys.all, 'stats', discordId] as const,
}

export function useUserStats(discordId: string) {
  return useQuery({
    queryKey: profileKeys.stats(discordId),
    queryFn: ({ signal }) => fetchUserStats(discordId, signal),
  })
}
