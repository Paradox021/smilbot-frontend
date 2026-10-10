import { http as mswHttp, HttpResponse } from 'msw'
import { apiUrl, server } from '@/test/server'
import { ApiError, http } from './http'

const expired = () =>
  HttpResponse.json({ error: 'Token expirado', code: 'TOKEN_EXPIRED' }, { status: 401 })

describe('http', () => {
  it('envía las peticiones a VITE_API_URL con credenciales y devuelve el JSON', async () => {
    let credentials: RequestCredentials | undefined
    server.use(
      mswHttp.get(apiUrl('/ping'), ({ request }) => {
        credentials = request.credentials
        return HttpResponse.json({ ok: true })
      }),
    )

    await expect(http.get('/ping')).resolves.toEqual({ ok: true })
    expect(credentials).toBe('include')
  })

  it('serializa el body como JSON', async () => {
    let contentType: string | null = null
    server.use(
      mswHttp.post(apiUrl('/echo'), async ({ request }) => {
        contentType = request.headers.get('content-type')
        return HttpResponse.json(await request.json())
      }),
    )

    await expect(http.post('/echo', { amount: 5 })).resolves.toEqual({ amount: 5 })
    expect(contentType).toBe('application/json')
  })

  it('devuelve undefined en respuestas sin cuerpo (204)', async () => {
    server.use(mswHttp.post(apiUrl('/auth/logout'), () => new HttpResponse(null, { status: 204 })))

    await expect(http.post('/auth/logout')).resolves.toBeUndefined()
  })

  it('transforma el cuerpo { error, code } en ApiError', async () => {
    server.use(
      mswHttp.get(apiUrl('/forbidden'), () =>
        HttpResponse.json({ error: 'Requiere permisos de administrador' }, { status: 403 }),
      ),
    )

    const error: unknown = await http.get('/forbidden').catch((e: unknown) => e)
    expect(error).toBeInstanceOf(ApiError)
    expect(error).toMatchObject({ status: 403, message: 'Requiere permisos de administrador' })
    expect((error as ApiError).code).toBeUndefined()
  })

  it('usa statusText si el cuerpo del error no tiene el formato esperado', async () => {
    server.use(
      mswHttp.get(apiUrl('/boom'), () =>
        HttpResponse.text('oops', { status: 500, statusText: 'Internal Server Error' }),
      ),
    )

    await expect(http.get('/boom')).rejects.toMatchObject({
      status: 500,
      message: 'Internal Server Error',
    })
  })

  it('convierte los fallos de red en ApiError con status 0', async () => {
    server.use(mswHttp.get(apiUrl('/offline'), () => HttpResponse.error()))

    await expect(http.get('/offline')).rejects.toMatchObject({ status: 0, code: 'NETWORK_ERROR' })
  })

  it('ante TOKEN_EXPIRED renueva la sesión y reintenta la petición una vez', async () => {
    let sessionRenewed = false
    let refreshCalls = 0
    server.use(
      mswHttp.post(apiUrl('/auth/refresh'), () => {
        refreshCalls++
        sessionRenewed = true
        return HttpResponse.json({ message: 'ok' })
      }),
      mswHttp.get(apiUrl('/auth/me'), () =>
        sessionRenewed ? HttpResponse.json({ username: 'Gamer123' }) : expired(),
      ),
    )

    await expect(http.get('/auth/me')).resolves.toEqual({ username: 'Gamer123' })
    expect(refreshCalls).toBe(1)
  })

  it('comparte un único refresh entre peticiones simultáneas', async () => {
    let sessionRenewed = false
    let refreshCalls = 0
    server.use(
      mswHttp.post(apiUrl('/auth/refresh'), async () => {
        refreshCalls++
        await new Promise((resolve) => setTimeout(resolve, 20))
        sessionRenewed = true
        return HttpResponse.json({ message: 'ok' })
      }),
      mswHttp.get(apiUrl('/data/:id'), ({ params }) =>
        sessionRenewed ? HttpResponse.json({ id: params.id }) : expired(),
      ),
    )

    const results = await Promise.all([
      http.get('/data/1'),
      http.get('/data/2'),
      http.get('/data/3'),
    ])

    expect(results).toEqual([{ id: '1' }, { id: '2' }, { id: '3' }])
    expect(refreshCalls).toBe(1)
  })

  it('lanza el 401 original si el refresh falla y no reintenta', async () => {
    let meCalls = 0
    server.use(
      mswHttp.post(apiUrl('/auth/refresh'), () =>
        HttpResponse.json({ error: 'Token inválido', code: 'TOKEN_INVALID' }, { status: 401 }),
      ),
      mswHttp.get(apiUrl('/auth/me'), () => {
        meCalls++
        return expired()
      }),
    )

    await expect(http.get('/auth/me')).rejects.toMatchObject({ status: 401, code: 'TOKEN_EXPIRED' })
    expect(meCalls).toBe(1)
  })

  it('no entra en bucle si el reintento vuelve a dar TOKEN_EXPIRED', async () => {
    let refreshCalls = 0
    server.use(
      mswHttp.post(apiUrl('/auth/refresh'), () => {
        refreshCalls++
        return HttpResponse.json({ message: 'ok' })
      }),
      mswHttp.get(apiUrl('/auth/me'), () => expired()),
    )

    await expect(http.get('/auth/me')).rejects.toMatchObject({ code: 'TOKEN_EXPIRED' })
    expect(refreshCalls).toBe(1)
  })

  it('no intenta renovar ante otros 401', async () => {
    let refreshCalls = 0
    server.use(
      mswHttp.post(apiUrl('/auth/refresh'), () => {
        refreshCalls++
        return HttpResponse.json({ message: 'ok' })
      }),
      mswHttp.get(apiUrl('/auth/me'), () =>
        HttpResponse.json({ error: 'No autenticado' }, { status: 401 }),
      ),
    )

    await expect(http.get('/auth/me')).rejects.toMatchObject({
      status: 401,
      message: 'No autenticado',
    })
    expect(refreshCalls).toBe(0)
  })
})
