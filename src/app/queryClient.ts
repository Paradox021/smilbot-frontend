import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query'
import { authKeys } from '@/features/auth'
import { isApiError } from '@/shared/lib/http'

const MAX_RETRIES = 2

function shouldRetry(failureCount: number, error: unknown): boolean {
  if (isApiError(error) && error.status >= 400 && error.status < 500) return false
  return failureCount < MAX_RETRIES
}

export function createQueryClient(): QueryClient {
  const queryClient: QueryClient = new QueryClient({
    queryCache: new QueryCache({ onError: handleError }),
    mutationCache: new MutationCache({ onError: handleError }),
    defaultOptions: {
      queries: { retry: shouldRetry, refetchOnWindowFocus: false },
      mutations: { retry: false },
    },
  })

  // Un 401 que sobrevive al refresh significa que la sesión ha terminado.
  function handleError(error: unknown) {
    if (isApiError(error) && error.status === 401) {
      queryClient.setQueryData(authKeys.me(), null)
    }
  }

  return queryClient
}
