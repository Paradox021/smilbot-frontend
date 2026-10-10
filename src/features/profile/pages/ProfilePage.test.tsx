import { screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { currentUserFixture } from '@/test/fixtures'
import { renderApp } from '@/test/render'
import { apiUrl, server } from '@/test/server'
import { profileTexts } from '../texts'

describe('ProfilePage', () => {
  it('muestra los datos de /auth/me', async () => {
    server.use(http.get(apiUrl('/auth/me'), () => HttpResponse.json(currentUserFixture)))
    renderApp('/perfil')

    expect(await screen.findByRole('heading', { name: profileTexts.title })).toBeInTheDocument()
    expect(screen.getByText('123456789012345678')).toBeInTheDocument()
    expect(screen.getByText('1.650 monedas')).toBeInTheDocument()
    expect(screen.getByText('11 días')).toBeInTheDocument()
    expect(screen.getByText('15 días')).toBeInTheDocument()
    expect(screen.queryByText(profileTexts.admin)).not.toBeInTheDocument()
  })

  it('marca a los administradores', async () => {
    server.use(
      http.get(apiUrl('/auth/me'), () =>
        HttpResponse.json({ ...currentUserFixture, isAdmin: true }),
      ),
    )
    renderApp('/perfil')

    expect(await screen.findByText(profileTexts.admin)).toBeInTheDocument()
  })
})
