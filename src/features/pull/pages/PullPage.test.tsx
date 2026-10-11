import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { appTexts } from '@/app/texts'
import { currentUserFixture, inventoryFixture, userStatsFixture } from '@/test/fixtures'
import { renderApp } from '@/test/render'
import { apiUrl, server } from '@/test/server'
import { pullTexts as t } from '../texts'
import type { PullResult } from '../types'

const mythicByPity: PullResult = {
  _id: '642dbd17fc0fd3e62bde6659',
  name: 'SwimmingLarry',
  description: 'Una carta mítica acuática',
  type: 4,
  roll: null,
  isPity: true,
  pity: { current: 0, threshold: 250, remaining: 250 },
}

const [ownedCard] = inventoryFixture.cards
if (!ownedCard) throw new Error('inventoryFixture necesita al menos una carta')

// Sin imagen: jsdom no carga imágenes y la precarga esperaría a su tiempo límite.
const ownedCommon: PullResult = {
  ...ownedCard,
  imageUrl: undefined,
  roll: 700,
  isPity: false,
  pity: { current: 245, threshold: 250, remaining: 5 },
}

const signedIn = () =>
  server.use(http.get(apiUrl('/auth/me'), () => HttpResponse.json(currentUserFixture)))

function withPull(response: PullResult) {
  const calls: string[] = []
  server.use(
    http.post(apiUrl('/user/:id/card/random'), ({ params }) => {
      calls.push(String(params.id))
      return HttpResponse.json(response)
    }),
  )
  return calls
}

const withPullError = (status: number, error: string) =>
  server.use(
    http.post(apiUrl('/user/:id/card/random'), () => HttpResponse.json({ error }, { status })),
  )

const openButton = () => screen.findByRole('button', { name: t.open('100') })

/** Espera a que el inventario esté en caché: "Nueva" se decide con él. */
async function renderPullPage() {
  const view = renderApp('/tirar')
  await waitFor(() =>
    expect(
      view.queryClient.getQueryData(['inventory', 'user', currentUserFixture.discordId]),
    ).toBeDefined(),
  )
  return view
}

describe('PullPage', () => {
  beforeEach(signedIn)

  it('muestra el sobre, el progreso de pity y el botón con el coste', async () => {
    await renderPullPage()

    expect(await openButton()).toBeEnabled()
    expect(screen.getByRole('heading', { level: 1, name: t.title })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: t.pack })).toBeInTheDocument()
    expect(screen.getByText(t.guaranteedIn(6, '6'))).toBeInTheDocument()
  })

  it('sin saldo suficiente desactiva el botón y dice cuánto falta', async () => {
    server.use(
      http.get(apiUrl('/user/:id/stats'), () =>
        HttpResponse.json({ ...userStatsFixture, balance: 60 }),
      ),
    )
    renderApp('/tirar')

    expect(await openButton()).toBeDisabled()
    expect(screen.getByText(t.shortfall('40'), { exact: false })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: t.claimDailyHint })).toHaveAttribute('href', '/inicio')
  })

  it('tira, permite saltar la animación y muestra una carta nueva garantizada por pity', async () => {
    const calls = withPull(mythicByPity)
    await renderPullPage()

    await userEvent.click(await openButton())
    await userEvent.click(await screen.findByRole('button', { name: t.skip }))

    expect(
      await screen.findByRole('heading', { level: 2, name: mythicByPity.name }),
    ).toBeInTheDocument()
    expect(calls).toEqual([currentUserFixture.discordId])
    expect(screen.getByText(t.newBadge)).toBeInTheDocument()
    expect(screen.getByText(t.pityBadge)).toBeInTheDocument()
    expect(screen.getByText(t.rarityLine('Mítica', '0,5 %'))).toBeInTheDocument()
    expect(screen.getByText(t.guaranteedIn(250, '250'))).toBeInTheDocument()
    expect(
      screen.getByText(
        `${t.announce(mythicByPity.name, 'Mítica')} ${t.announceNew} ${t.smilbot.pityMythic}`,
      ),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: t.openAnother('100') })).toBeInTheDocument()
  })

  it('se salta con cualquier tecla', async () => {
    withPull(mythicByPity)
    await renderPullPage()

    await userEvent.click(await openButton())
    await screen.findByRole('button', { name: t.skip })
    await userEvent.keyboard('{Escape}')

    expect(
      await screen.findByRole('heading', { level: 2, name: mythicByPity.name }),
    ).toBeInTheDocument()
  })

  it('sin saltar, una carta repetida se revela sola y cuenta las copias', async () => {
    withPull(ownedCommon)
    await renderPullPage()

    await userEvent.click(await openButton())

    expect(
      await screen.findByRole('heading', { level: 2, name: ownedCommon.name }, { timeout: 3000 }),
    ).toBeInTheDocument()
    expect(screen.queryByText(t.newBadge)).not.toBeInTheDocument()
    expect(screen.queryByText(t.pityBadge)).not.toBeInTheDocument()
    expect(screen.getByText(t.copiesLabel('4'))).toBeInTheDocument()
    expect(
      screen.getByText(`${t.announce(ownedCommon.name, 'Común')} ${t.smilbot.duplicate}`),
    ).toBeInTheDocument()
    expect(screen.getByText(t.guaranteedIn(5, '5'))).toBeInTheDocument()
  })

  it.each([
    [400, 'No tienes suficientes monedas. Necesitas 100 y tienes 40', t.notEnoughCoins],
    [404, 'No cards found for this type', t.noCardsForRarity],
    [500, 'Error interno', t.pullError],
  ])('un %i vuelve al estado inicial con su mensaje', async (status, error, message) => {
    withPullError(status, error)
    await renderPullPage()

    await userEvent.click(await openButton())

    expect(await screen.findByRole('alert')).toHaveTextContent(message)
    expect(await openButton()).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: t.skip })).not.toBeInTheDocument()
  })

  it('tras tirar refresca las stats del usuario', async () => {
    let statsCalls = 0
    server.use(
      http.get(apiUrl('/user/:id/stats'), () => {
        statsCalls++
        return HttpResponse.json(userStatsFixture)
      }),
    )
    withPull(ownedCommon)
    await renderPullPage()
    await openButton()
    const before = statsCalls

    await userEvent.click(await openButton())
    await waitFor(() => expect(statsCalls).toBeGreaterThan(before))
  })

  it('la navegación lleva a la tirada', async () => {
    const { router } = renderApp('/inicio')

    const links = await screen.findAllByRole('link', { name: appTexts.navPull })
    expect(links).toHaveLength(2)
    await userEvent.click(links[0] as HTMLElement)

    await openButton()
    expect(router.state.location.pathname).toBe('/tirar')
  })
})
