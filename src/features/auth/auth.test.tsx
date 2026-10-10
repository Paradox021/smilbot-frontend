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

  it('la guarda pasa la ruta original como returnTo al login', async () => {
    signedOut()
    const { router } = renderApp('/perfil?tab=stats')

    const link = await screen.findByRole('link', { name: authTexts.loginWithDiscord })
    expect(router.state.location.pathname).toBe('/')
    expect(link).toHaveAttribute(
      'href',
      `${API_URL}/auth/discord?returnTo=${encodeURIComponent('/perfil?tab=stats')}`,
    )
  })

  it('tras un login fallido en una ruta privada muestra el error y conserva el retorno', async () => {
    signedOut()
    renderApp('/perfil?login=error')

    expect(await screen.findByText(authTexts.loginError)).toBeInTheDocument()
    const link = await screen.findByRole('link', { name: authTexts.loginWithDiscord })
    expect(link).toHaveAttribute('href', `${API_URL}/auth/discord?returnTo=%2Fperfil`)
  })

  it('tras un login correcto se queda en la ruta privada de retorno', async () => {
    signedIn()
    const { router } = renderApp('/perfil?login=success')

    expect(await screen.findByText(authTexts.loginSuccess)).toBeInTheDocument()
    await waitFor(() => expect(router.state.location.search).toBe(''))
    expect(router.state.location.pathname).toBe('/perfil')
  })

  it('con sesión muestra el avatar (o sus iniciales) en la cabecera', async () => {
    signedIn()
    renderApp('/perfil')

    await screen.findByRole('heading', { name: currentUserFixture.username })
    expect(screen.getAllByText('GA').length).toBeGreaterThan(0)
  })

  it('la guarda deja pasar con sesión', async () => {
    signedIn()
    renderApp('/perfil')

    expect(
      await screen.findByRole('heading', { name: currentUserFixture.username }),
    ).toBeInTheDocument()
  })

  it('con sesión, la portada lleva al inicio', async () => {
    signedIn()
    const { router } = renderApp('/')

    await screen.findByRole('heading', { name: `Hola, ${currentUserFixture.username}` })
    expect(router.state.location.pathname).toBe('/inicio')
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
    expect(
      await screen.findByRole('heading', { name: currentUserFixture.username }),
    ).toBeInTheDocument()
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

    await userEvent.click(await screen.findByRole('button', { name: authTexts.userMenu }))
    await userEvent.click(await screen.findByRole('menuitem', { name: authTexts.logout }))

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
