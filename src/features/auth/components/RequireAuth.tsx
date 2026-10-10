import { Navigate, Outlet } from 'react-router'
import { ROUTES } from '@/shared/config/routes'
import { useCurrentUser } from '../queries'
import { SessionError, SessionLoading } from './SessionStatus'

/** Guarda de rutas privadas. Solo controla la navegación: la autorización real la hace el backend. */
export function RequireAuth() {
  const { data: user, isPending, isError, refetch } = useCurrentUser()

  if (isPending) return <SessionLoading />
  if (isError) return <SessionError onRetry={() => void refetch()} />
  if (!user) return <Navigate to={ROUTES.home} replace />

  return <Outlet />
}
