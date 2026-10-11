import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Card } from '@/features/cards'
import {
  addCardToInventory,
  inventoryKeys,
  countCopies,
  type Inventory,
} from '@/features/inventory'
import { statsKeys } from '@/features/stats'
import { preloadImage } from '@/shared/lib/preloadImage'
import { pullCard } from './api'
import type { PullOutcome, PullResult } from './types'

function toCard({ _id, name, description, type, imageUrl, author }: PullResult): Card {
  return { _id, name, description, type, imageUrl, author }
}

export function usePullMutation(discordId: string) {
  const queryClient = useQueryClient()
  const inventoryKey = inventoryKeys.user(discordId)

  return useMutation({
    mutationFn: async (): Promise<PullOutcome> => {
      // "Nueva" se decide con el inventario que ya hay en caché, antes de tirar.
      const before = queryClient.getQueryData<Inventory>(inventoryKey)
      const result = await pullCard(discordId)
      // Mientras se baraja: así la cara se pinta ya con su tamaño final al girar.
      await preloadImage(result.imageUrl)
      if (!before) return { result, isNew: null, copies: null }
      const copies = countCopies(before, result._id) + 1
      return { result, isNew: copies === 1, copies }
    },
    onSuccess: ({ result }) => {
      queryClient.setQueryData<Inventory>(
        inventoryKey,
        (inventory) => inventory && addCardToInventory(inventory, toCard(result)),
      )
      void queryClient.invalidateQueries({ queryKey: inventoryKey })
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: statsKeys.user(discordId) }),
  })
}
