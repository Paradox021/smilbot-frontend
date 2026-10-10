/**
 * Identidad del usuario según `GET /auth/me` (ver `Backend API/Autenticacion.md`).
 * El backend devuelve más campos del `User`, pero aquí solo se tipa la identidad a propósito:
 * saldo, rachas y stats se piden a su propia feature.
 */
export interface CurrentUser {
  discordId: string
  username: string
  isAdmin: boolean
  /** Avatar de Discord (o el avatar por defecto de Discord); siempre presente. */
  avatarUrl: string
}

export type LoginResult = 'success' | 'error'
