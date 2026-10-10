import { Navigate, Outlet, useLocation } from 'react-router'
import { ROUTES } from '@/shared/config/routes'
import { useCurrentUser } from '../queries'
import { buildReturnTo, type LoginRedirectState } from '../returnTo'
import { SessionError, SessionLoading } from './SessionStatus'

/** Guarda de rutas privadas. Solo controla la navegación: la autorización real la hace el backend. */
export function RequireAuth() {
  const { data: user, isPending, isError, refetch } = useCurrentUser()
  const location = useLocation()

  if (isPending) return <SessionLoading />
  if (isError) return <SessionError onRetry={() => void refetch()} />
  if (!user) {
    const returnTo = buildReturnTo(location.pathname, location.search)
    const state: LoginRedirectState | undefined = returnTo ? { returnTo } : undefined
    return <Navigate to={ROUTES.home} replace state={state} />
  }

  return <Outlet />
}
