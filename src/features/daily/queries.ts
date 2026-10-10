import { useMutation, useQueryClient } from '@tanstack/react-query'
import { statsKeys } from '@/features/stats'
import { claimDaily } from './api'

export function useClaimDailyMutation(discordId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => claimDaily(discordId),
    // Se espera al refetch para que, al terminar, las stats (saldo, racha, próximo daily) ya estén al día.
    onSettled: () => queryClient.invalidateQueries({ queryKey: statsKeys.user(discordId) }),
  })
}
