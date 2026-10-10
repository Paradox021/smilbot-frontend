import { ROUTES } from '@/shared/config/routes'
import { LOGIN_PARAM } from './hooks/useLoginResult'

/** Estado de navegación con el que la guarda manda al inicio a un usuario sin sesión. */
export interface LoginRedirectState {
  returnTo: string
}

/**
 * Solo se aceptan rutas relativas de la propia app (empiezan por `/`, pero no por `//` ni `/\`),
 * igual que valida el backend en `GET /auth/discord?returnTo=`. La raíz no se considera retorno.
 */
export function sanitizeReturnTo(value: unknown): string | null {
  if (typeof value !== 'string') return null
  if (!value.startsWith('/') || value.startsWith('//') || value.startsWith('/\\')) return null
  if (value === ROUTES.home) return null
  return value
}

/** Construye la ruta de retorno a partir de la ubicación actual, sin el parámetro de resultado del login. */
export function buildReturnTo(pathname: string, search: string): string | null {
  const params = new URLSearchParams(search)
  params.delete(LOGIN_PARAM)
  const query = params.toString()
  return sanitizeReturnTo(query ? `${pathname}?${query}` : pathname)
}

export function getReturnTo(state: unknown): string | null {
  if (typeof state !== 'object' || state === null || !('returnTo' in state)) return null
  return sanitizeReturnTo(state.returnTo)
}
