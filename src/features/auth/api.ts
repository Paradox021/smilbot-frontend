import { env } from '@/shared/lib/env'
import { http, isApiError } from '@/shared/lib/http'
import type { CurrentUser } from './types'

const discordLoginBaseUrl = `${env.VITE_API_URL}/auth/discord`

/** URL de login con Discord. Si se indica `returnTo`, el backend vuelve a esa ruta tras el login. */
export function getDiscordLoginUrl(returnTo?: string | null): string {
  if (!returnTo) return discordLoginBaseUrl
  return `${discordLoginBaseUrl}?returnTo=${encodeURIComponent(returnTo)}`
}

/** Devuelve `null` si no hay sesión (o si no se pudo renovar). */
export async function fetchCurrentUser(signal?: AbortSignal): Promise<CurrentUser | null> {
  try {
    return await http.get<CurrentUser>('/auth/me', { signal })
  } catch (error) {
    if (isApiError(error) && error.status === 401) return null
    throw error
  }
}

export async function logout(): Promise<void> {
  await http.post<undefined>('/auth/logout')
}
