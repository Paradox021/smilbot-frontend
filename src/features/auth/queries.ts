import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { ROUTES } from '@/shared/config/routes'
import { fetchCurrentUser, logout } from './api'

export const authKeys = {
  all: ['auth'] as const,
  me: () => [...authKeys.all, 'me'] as const,
}

export function useCurrentUser() {
  return useQuery({
    queryKey: authKeys.me(),
    queryFn: ({ signal }) => fetchCurrentUser(signal),
    staleTime: 5 * 60 * 1000,
  })
}

export function useLogoutMutation() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear()
      queryClient.setQueryData(authKeys.me(), null)
      void navigate(ROUTES.home, { replace: true })
    },
  })
}
