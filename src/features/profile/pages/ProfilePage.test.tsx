import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { currentUserFixture, userStatsFixture } from '@/test/fixtures'
import { renderApp } from '@/test/render'
import { apiUrl, server } from '@/test/server'
import { profileTexts } from '../texts'
import type { UserStats } from '../types'

const signedIn = (user = currentUserFixture) =>
  server.use(http.get(apiUrl('/auth/me'), () => HttpResponse.json(user)))

const withStats = (stats: UserStats) =>
  server.use(http.get(apiUrl('/user/:id/stats'), () => HttpResponse.json(stats)))

function statValue(label: string) {
  const term = screen.getByText(label, { selector: 'dt' })
  return term.nextElementSibling?.textContent
}

describe('ProfilePage', () => {
  it('muestra la identidad de /auth/me y las stats de /user/:id/stats', async () => {
    let requestedId: string | undefined
    signedIn()
    server.use(
      http.get(apiUrl('/user/:id/stats'), ({ params }) => {
        requestedId = String(params.id)
        return HttpResponse.json(userStatsFixture)
      }),
    )
    renderApp('/perfil')

    expect(await screen.findByRole('heading', { name: 'Gamer123' })).toBeInTheDocument()
    expect(screen.getByText('123456789012345678')).toBeInTheDocument()
    expect(screen.queryByText(profileTexts.admin)).not.toBeInTheDocument()

    await screen.findByText(profileTexts.economyTitle)
    expect(requestedId).toBe(currentUserFixture.discordId)
    expect(statValue(profileTexts.balance)).toBe('1.650 monedas')
    expect(statValue(profileTexts.dailyStreak)).toBe('11 días')
    expect(statValue(profileTexts.maxDailyStreak)).toBe('15 días')
    expect(statValue(profileTexts.cardsCount)).toBe('35')
    expect(statValue(profileTexts.memberSince)).toBe('12 de marzo de 2025')
    expect(statValue(profileTexts.luckPercentage)).toBe('138,5 %')
    expect(statValue(profileTexts.luckDelta)).toBe('+38,5 %')
    expect(screen.getByText('Afortunado')).toBeInTheDocument()
    expect(screen.getByText(profileTexts.eligibleForLeaderboard)).toBeInTheDocument()
    expect(screen.getByText('244 / 250 tiradas')).toBeInTheDocument()
    expect(
      screen.getByRole('progressbar', { name: profileTexts.pityProgressLabel }),
    ).toBeInTheDocument()
  })

  it('muestra el desglose por rareza', async () => {
    signedIn()
    renderApp('/perfil')

    const breakdown = (await screen.findByText(profileTexts.breakdownTitle)).closest('section')
    expect(breakdown).not.toBeNull()
    const items = within(breakdown as HTMLElement).getAllByRole('listitem')
    expect(items.map((item) => item.textContent)).toEqual([
      'Común18',
      'Rara11',
      'Épica4',
      'Legendaria2',
      'Mítica0',
    ])
  })

  it('muestra el daily disponible y cuándo se rompe la racha', async () => {
    const inHours = (hours: number) => new Date(Date.now() + hours * 3_600_000).toISOString()
    signedIn()
    withStats({ ...userStatsFixture, nextDailyAt: inHours(-1), streakExpiresAt: inHours(23) })
    renderApp('/perfil')

    expect(await screen.findByText(profileTexts.dailyAvailable)).toBeInTheDocument()
    expect(screen.getByText('La racha se rompe dentro de 23 horas')).toBeInTheDocument()
  })

  it('muestra cuándo llega el próximo daily y oculta datos ausentes', async () => {
    const inHours = (hours: number) => new Date(Date.now() + hours * 3_600_000).toISOString()
    signedIn()
    withStats({
      ...userStatsFixture,
      createdAt: null,
      dailyStreak: 0,
      nextDailyAt: inHours(5),
      streakExpiresAt: null,
    })
    renderApp('/perfil')

    expect(await screen.findByText('Próximo daily dentro de 5 horas')).toBeInTheDocument()
    expect(screen.queryByText(profileTexts.dailyAvailable)).not.toBeInTheDocument()
    expect(screen.queryByText(/La racha se rompe/)).not.toBeInTheDocument()
    expect(screen.queryByText(profileTexts.memberSince)).not.toBeInTheDocument()
  })

  it('marca a los administradores', async () => {
    signedIn({ ...currentUserFixture, isAdmin: true })
    renderApp('/perfil')

    expect(await screen.findByText(profileTexts.admin)).toBeInTheDocument()
  })

  it('muestra un estado vacío de suerte si aún no hay tiradas', async () => {
    signedIn()
    withStats({
      ...userStatsFixture,
      luck: { ...userStatsFixture.luck, totalCards: 0, eligibleForLeaderboard: false },
    })
    renderApp('/perfil')

    expect(await screen.findByText(profileTexts.luckEmpty)).toBeInTheDocument()
    expect(screen.queryByText(profileTexts.breakdownTitle)).not.toBeInTheDocument()
  })

  it('usa el nombre del backend si el tier no es conocido', async () => {
    signedIn()
    withStats({
      ...userStatsFixture,
      luck: { ...userStatsFixture.luck, tier: 'Mystery', tierCode: 'MYSTERY' },
    })
    renderApp('/perfil')

    expect(await screen.findByText('Mystery')).toBeInTheDocument()
  })

  it('muestra un error con reintento si fallan las stats', async () => {
    let calls = 0
    signedIn()
    server.use(
      http.get(apiUrl('/user/:id/stats'), () => {
        calls++
        return calls === 1
          ? HttpResponse.json({ error: 'Error interno' }, { status: 500 })
          : HttpResponse.json(userStatsFixture)
      }),
    )
    renderApp('/perfil')

    await userEvent.click(await screen.findByRole('button', { name: profileTexts.retry }))
    expect(await screen.findByText(profileTexts.economyTitle)).toBeInTheDocument()
  })
})
