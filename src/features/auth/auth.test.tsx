import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { currentUserFixture } from '@/test/fixtures'
import { renderApp } from '@/test/render'
import { API_URL, apiUrl, server } from '@/test/server'
import { authTexts } from './texts'

const signedIn = () =>
  server.use(http.get(apiUrl('/auth/me'), () => HttpResponse.json(currentUserFixture)))

const signedOut = () =>
  server.use(
    http.get(apiUrl('/auth/me'), () =>
      HttpResponse.json({ error: 'No autenticado' }, { status: 401 }),
    ),
  )

describe('auth', () => {
  it('sin sesión muestra el botón de entrar que navega a /auth/discord', async () => {
    signedOut()
    renderApp('/')

    const link = await screen.findByRole('link', { name: authTexts.loginWithDiscord })
    expect(link).toHaveAttribute('href', `${API_URL}/auth/discord`)
  })

  it('la guarda redirige al inicio si no hay sesión', async () => {
    signedOut()
    const { router } = renderApp('/perfil')

    await screen.findByRole('link', { name: authTexts.loginWithDiscord })
    expect(router.state.location.pathname).toBe('/')
  })

  it('la guarda deja pasar con sesión', async () => {
    signedIn()
    renderApp('/perfil')

    expect(await screen.findByRole('heading', { name: 'Mi perfil' })).toBeInTheDocument()
  })

  it('con sesión, el inicio lleva al perfil', async () => {
    signedIn()
    const { router } = renderApp('/')

    await screen.findByRole('heading', { name: 'Mi perfil' })
    expect(router.state.location.pathname).toBe('/perfil')
  })

  it('muestra un error con reintento si no se puede comprobar la sesión', async () => {
    let calls = 0
    server.use(
      http.get(apiUrl('/auth/me'), () => {
        calls++
        return calls === 1
          ? HttpResponse.json({ error: 'Error interno' }, { status: 500 })
          : HttpResponse.json(currentUserFixture)
      }),
    )
    renderApp('/perfil')

    await userEvent.click(await screen.findByRole('button', { name: authTexts.retry }))
    expect(await screen.findByRole('heading', { name: 'Mi perfil' })).toBeInTheDocument()
  })

  it('lee ?login=success, lo muestra y limpia la URL', async () => {
    signedIn()
    const { router } = renderApp('/?login=success')

    expect(await screen.findByText(authTexts.loginSuccess)).toBeInTheDocument()
    await waitFor(() => expect(router.state.location.search).toBe(''))
  })

  it('lee ?login=error, lo muestra y permite cerrarlo', async () => {
    signedOut()
    const { router } = renderApp('/?login=error')

    expect(await screen.findByText(authTexts.loginError)).toBeInTheDocument()
    await waitFor(() => expect(router.state.location.search).toBe(''))

    await userEvent.click(screen.getByRole('button', { name: authTexts.dismiss }))
    expect(screen.queryByText(authTexts.loginError)).not.toBeInTheDocument()
  })

  it('al cerrar sesión llama a /auth/logout y vuelve al inicio', async () => {
    let loggedOut = false
    server.use(
      http.get(apiUrl('/auth/me'), () =>
        loggedOut
          ? HttpResponse.json({ error: 'No autenticado' }, { status: 401 })
          : HttpResponse.json(currentUserFixture),
      ),
      http.post(apiUrl('/auth/logout'), () => {
        loggedOut = true
        return new HttpResponse(null, { status: 204 })
      }),
    )
    const { router } = renderApp('/perfil')

    await userEvent.click(await screen.findByRole('button', { name: authTexts.logout }))

    await screen.findByRole('link', { name: authTexts.loginWithDiscord })
    expect(loggedOut).toBe(true)
    expect(router.state.location.pathname).toBe('/')
  })

  it('si la sesión caduca y el refresh falla, vuelve al inicio', async () => {
    server.use(
      http.get(apiUrl('/auth/me'), () =>
        HttpResponse.json({ error: 'Token expirado', code: 'TOKEN_EXPIRED' }, { status: 401 }),
      ),
      http.post(apiUrl('/auth/refresh'), () =>
        HttpResponse.json({ error: 'Token inválido', code: 'TOKEN_INVALID' }, { status: 401 }),
      ),
    )
    const { router } = renderApp('/perfil')

    await screen.findByRole('link', { name: authTexts.loginWithDiscord })
    expect(router.state.location.pathname).toBe('/')
  })
})
