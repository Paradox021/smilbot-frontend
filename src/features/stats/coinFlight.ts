const COINS = 6
const FLIGHT_MS = 750
const STAGGER_MS = 55
const COIN_CLASS =
  'pointer-events-none fixed z-50 -mt-2 -ml-2 size-4 rounded-full border-2 border-primary-pressed bg-primary'

const center = (rect: DOMRect) => ({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 })

/**
 * Monedas que saltan desde `from` y vuelan hasta `to`. Con Web Animations y sin Motion: la píldora
 * del saldo vive en la cabecera (bundle principal). Se resuelve cuando ha llegado la última.
 */
export function flyCoins(from: DOMRect, to: DOMRect): Promise<void> {
  if (typeof Element.prototype.animate !== 'function') return Promise.resolve()
  const start = center(from)
  const end = { x: to.left + 16, y: to.top + to.height / 2 }
  const dx = end.x - start.x
  const dy = end.y - start.y

  const flights = Array.from({ length: COINS }, (_, index) => {
    const coin = document.createElement('span')
    coin.className = COIN_CLASS
    coin.setAttribute('aria-hidden', 'true')
    coin.style.left = `${start.x}px`
    coin.style.top = `${start.y}px`
    document.body.append(coin)

    const spread = (index - (COINS - 1) / 2) * 16
    const lift = -36 - (index % 3) * 14
    return coin
      .animate(
        [
          { transform: 'translate(0, 0) scale(0.5)', opacity: 0 },
          { transform: `translate(${spread}px, ${lift}px) scale(1)`, opacity: 1, offset: 0.3 },
          { transform: `translate(${dx}px, ${dy}px) scale(0.75)`, opacity: 1, offset: 0.92 },
          { transform: `translate(${dx}px, ${dy}px) scale(0.4)`, opacity: 0 },
        ],
        {
          duration: FLIGHT_MS,
          delay: index * STAGGER_MS,
          easing: 'cubic-bezier(0.5, 0, 0.3, 1)',
          fill: 'both',
        },
      )
      .finished.catch(() => undefined)
      .finally(() => coin.remove())
  })
  return Promise.all(flights).then(() => undefined)
}
