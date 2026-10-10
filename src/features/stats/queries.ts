import { useQuery } from '@tanstack/react-query'
import { fetchUserStats } from './api'

export const statsKeys = {
  all: ['stats'] as const,
  user: (discordId: string) => [...statsKeys.all, 'user', discordId] as const,
}

export function useUserStats(discordId: string) {
  return useQuery({
    queryKey: statsKeys.user(discordId),
    queryFn: ({ signal }) => fetchUserStats(discordId, signal),
  })
}
