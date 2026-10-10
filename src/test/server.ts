import { setupServer } from 'msw/node'

export const API_URL = 'http://api.test'

export const apiUrl = (path: string) => `${API_URL}${path}`

export const server = setupServer()
