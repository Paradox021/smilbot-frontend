import { env } from '@/shared/lib/env'

export class ApiError extends Error {
  readonly status: number
  readonly code?: string

  constructor(status: number, message: string, code?: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

interface RequestOptions {
  method?: HttpMethod
  body?: unknown
  signal?: AbortSignal
}

let refreshPromise: Promise<boolean> | null = null

function refreshSession(): Promise<boolean> {
  refreshPromise ??= fetch(`${env.VITE_API_URL}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
  })
    .then(
      (response) => response.ok,
      () => false,
    )
    .finally(() => {
      refreshPromise = null
    })
  return refreshPromise
}

async function toApiError(response: Response): Promise<ApiError> {
  const body: unknown = await response.json().catch(() => null)
  if (typeof body === 'object' && body !== null) {
    const { error, code } = body as Record<string, unknown>
    if (typeof error === 'string') {
      return new ApiError(response.status, error, typeof code === 'string' ? code : undefined)
    }
  }
  return new ApiError(response.status, response.statusText || `Error HTTP ${response.status}`)
}

async function parseBody<T>(response: Response): Promise<T> {
  const text = await response.text()
  return (text ? JSON.parse(text) : undefined) as T
}

async function request<T>(path: string, options: RequestOptions, canRetry: boolean): Promise<T> {
  const { method = 'GET', body, signal } = options
  const hasBody = body !== undefined

  let response: Response
  try {
    response = await fetch(`${env.VITE_API_URL}${path}`, {
      method,
      signal,
      credentials: 'include',
      headers: hasBody ? { 'Content-Type': 'application/json' } : undefined,
      body: hasBody ? JSON.stringify(body) : undefined,
    })
  } catch (cause) {
    if (signal?.aborted) throw cause
    throw new ApiError(0, 'No se pudo conectar con el servidor', 'NETWORK_ERROR')
  }

  if (response.ok) return parseBody<T>(response)

  const error = await toApiError(response)
  if (canRetry && error.status === 401 && error.code === 'TOKEN_EXPIRED') {
    if (await refreshSession()) return request<T>(path, options, false)
  }
  throw error
}

export const http = {
  get: <T>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(path, { ...options, method: 'GET' }, true),
  post: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(path, { ...options, method: 'POST', body }, true),
  delete: <T>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(path, { ...options, method: 'DELETE' }, true),
}
