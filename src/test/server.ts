import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { inventoryFixture, userStatsFixture } from './fixtures'

export const API_URL = 'http://api.test'

export const apiUrl = (path: string) => `${API_URL}${path}`

/** Respuestas por defecto; cada test sobrescribe lo que necesite con `server.use`. */
const defaultHandlers = [
  http.get(apiUrl('/user/:id/stats'), () => HttpResponse.json(userStatsFixture)),
  http.get(apiUrl('/user/:id/cards'), () => HttpResponse.json(inventoryFixture)),
]

export const server = setupServer(...defaultHandlers)
