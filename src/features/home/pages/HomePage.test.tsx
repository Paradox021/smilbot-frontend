import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { dailyTexts } from '@/features/daily'
import type { UserStats } from '@/features/stats'
import { currentUserFixture, userStatsFixture } from '@/test/fixtures'
import { renderApp } from '@/test/render'
import { apiUrl, server } from '@/test/server'
import { homeTexts } from '../texts'

const inHours = (hours: number) => new Date(Date.now() + hours * 3_600_000).toISOString()

const availableStats: UserStats = {
  ...userStatsFixture,
  dailyStreak: 11,
  nextDailyAt: inHours(-2),
  streakExpiresAt: inHours(23),
}

const cooldownStats: UserStats = {
  ...userStatsFixture,
  nextDailyAt: inHours(5),
  streakExpiresAt: inHours(30),
}

const claimResponse = {
  ok: true,
  balance: 1750,
  dailyStreak: 12,
  previousStreak: 11,
  maxDailyStreak: 15,
  previousMaxStreak: 10,
  isNewRecord: false,
  totalDailiesClaimed: 43,
}

const signedIn = () =>
  server.use(http.get(apiUrl('/auth/me'), () => HttpResponse.json(currentUserFixture)))

const withStats = (stats: UserStats) =>
  server.use(http.get(apiUrl('/user/:id/stats'), () => HttpResponse.json(stats)))

/** Stats disponibles hasta que se reclama; después, `afterClaim`. */
function withClaim(response: typeof claimResponse, afterClaim: UserStats) {
  const calls: string[] = []
  server.use(
    http.get(apiUrl('/user/:id/stats'), () =>
      HttpResponse.json(calls.length > 0 ? afterClaim : availableStats),
    ),
    http.post(apiUrl('/user/:id/dailyBalance'), ({ params }) => {
      calls.push(String(params.id))
      return HttpResponse.json(response)
    }),
  )
  return calls
}

const claimButton = () => screen.findByRole('button', { name: dailyTexts.claim })
const headerBalance = () => screen.getByText('Saldo:', { exact: false }).parentElement

describe('HomePage', () => {
  it('saluda y muestra racha, pity y saldo en la cabecera', async () => {
    signedIn()
    withStats(cooldownStats)
    renderApp('/inicio')

    expect(
      await screen.findByRole('heading', { name: homeTexts.greeting('Gamer123') }),
    ).toBeInTheDocument()
    expect(await screen.findByText(homeTexts.streakDays(11, '11'))).toBeInTheDocument()
    expect(screen.getByText(homeTexts.streakWeek('2'))).toBeInTheDocument()
    expect(screen.getByRole('img', { name: homeTexts.streakPaws(4) })).toBeInTheDocument()
    expect(screen.getByText(homeTexts.pullsUntilGuaranteed(6, '6'))).toBeInTheDocument()
    expect(headerBalance()).toHaveTextContent('1.650')
  })

  it('Smilbot avisa de lo más importante', async () => {
    signedIn()
    withStats(availableStats)
    const { unmount } = renderApp('/inicio')
    expect(await screen.findByText(homeTexts.smilbot.dailyReady('100'))).toBeInTheDocument()
    unmount()

    withStats(cooldownStats)
    renderApp('/inicio')
    expect(await screen.findByText(homeTexts.smilbot.pityClose(6, '6'))).toBeInTheDocument()
  })

  it('en cooldown muestra la cuenta atrás y no deja reclamar', async () => {
    signedIn()
    withStats(cooldownStats)
    renderApp('/inicio')

    expect(await screen.findByText(dailyTexts.nextIn)).toBeInTheDocument()
    expect(screen.getByRole('timer')).toHaveTextContent(/^0[45]:\d{2}:\d{2}$/)
    expect(screen.queryByRole('button', { name: dailyTexts.claim })).not.toBeInTheDocument()
  })

  it('la acción principal es el daily si está disponible y, si no, abrir un sobre', async () => {
    signedIn()
    withStats(availableStats)
    const { unmount } = renderApp('/inicio')

    expect(await claimButton()).toHaveAttribute('data-variant', 'default')
    expect(
      await screen.findByRole('link', { name: homeTexts.openPackSecondary('100') }),
    ).toHaveAttribute('data-variant', 'secondary')
    unmount()

    withStats(cooldownStats)
    renderApp('/inicio')
    expect(await screen.findByRole('link', { name: homeTexts.openPack('100') })).toHaveAttribute(
      'data-variant',
      'default',
    )
    expect(
      screen.queryByRole('link', { name: homeTexts.openPackSecondary('100') }),
    ).not.toBeInTheDocument()
  })

  it('reclama el daily, muestra el resultado y refresca las stats', async () => {
    signedIn()
    const calls = withClaim(claimResponse, {
      ...cooldownStats,
      balance: 1750,
      dailyStreak: 12,
      nextDailyAt: inHours(23),
    })
    renderApp('/inicio')

    expect(await screen.findByText(dailyTexts.keepStreak('12'))).toBeInTheDocument()
    await userEvent.click(await claimButton())

    expect(await screen.findByText(dailyTexts.streakContinues('12'))).toBeInTheDocument()
    expect(screen.getByText(dailyTexts.reward('100'))).toBeInTheDocument()
    expect(calls).toEqual([currentUserFixture.discordId])
    expect(screen.getByRole('timer')).toBeInTheDocument()
    await waitFor(() => expect(headerBalance()).toHaveTextContent('1.750'))
  })

  it('avisa de un nuevo récord', async () => {
    signedIn()
    withClaim({ ...claimResponse, dailyStreak: 16, isNewRecord: true }, cooldownStats)
    renderApp('/inicio')

    await userEvent.click(await claimButton())
    expect(await screen.findByText(dailyTexts.newRecord('16'))).toBeInTheDocument()
  })

  it('avisa si se perdió la racha anterior', async () => {
    signedIn()
    withClaim({ ...claimResponse, dailyStreak: 1, previousStreak: 9 }, cooldownStats)
    renderApp('/inicio')

    await userEvent.click(await claimButton())
    expect(await screen.findByText(dailyTexts.streakBroken('9'))).toBeInTheDocument()
  })

  it('avisa si la racha está a punto de caducar', async () => {
    signedIn()
    withStats({ ...availableStats, nextDailyAt: inHours(-20), streakExpiresAt: inHours(3) })
    renderApp('/inicio')

    expect(
      await screen.findByText(dailyTexts.streakAtRisk('11', 'dentro de 3 horas')),
    ).toBeInTheDocument()
    expect(
      screen.getByText(homeTexts.smilbot.streakAtRisk('11', 'dentro de 3 horas')),
    ).toBeInTheDocument()
  })

  it('sin racha activa invita a empezar una', async () => {
    signedIn()
    withStats({ ...availableStats, dailyStreak: 0, streakExpiresAt: null })
    renderApp('/inicio')

    expect(await screen.findByText(homeTexts.streakNone)).toBeInTheDocument()
    expect(screen.queryByText(/Reclámala para llevar/)).not.toBeInTheDocument()
  })

  it('si el backend rechaza el reclamo por cooldown lo explica', async () => {
    signedIn()
    withStats(availableStats)
    server.use(
      http.post(apiUrl('/user/:id/dailyBalance'), () =>
        HttpResponse.json(
          { error: "You can't use this command yet...", diffHours: 1, diffMinutes: 5 },
          { status: 400 },
        ),
      ),
    )
    renderApp('/inicio')

    await userEvent.click(await claimButton())
    expect(await screen.findByText(dailyTexts.cooldownError)).toBeInTheDocument()
  })

  it('muestra un error con reintento si fallan las stats', async () => {
    let calls = 0
    signedIn()
    server.use(
      http.get(apiUrl('/user/:id/stats'), () => {
        calls++
        return calls === 1
          ? HttpResponse.json({ error: 'Error interno' }, { status: 500 })
          : HttpResponse.json(cooldownStats)
      }),
    )
    renderApp('/inicio')

    await userEvent.click(await screen.findByRole('button', { name: homeTexts.retry }))
    expect(await screen.findByText(dailyTexts.nextIn)).toBeInTheDocument()
  })
})
