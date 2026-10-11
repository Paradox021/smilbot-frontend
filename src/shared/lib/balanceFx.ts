/**
 * Efectos del saldo de la cabecera (monedas que llegan, "−100" al tirar). Las features que cambian
 * el saldo los anuncian aquí y la píldora del saldo los pinta, sin importarse entre ellas.
 */
export type BalanceFx =
  | { kind: 'gain'; amount: number; /** Desde dónde salen las monedas. */ from?: DOMRect }
  | { kind: 'spend'; amount: number }

const EVENT = 'balance-fx'
const target = new EventTarget()

export function emitBalanceFx(fx: BalanceFx): void {
  target.dispatchEvent(new CustomEvent<BalanceFx>(EVENT, { detail: fx }))
}

export function onBalanceFx(listener: (fx: BalanceFx) => void): () => void {
  const handler = (event: Event) => listener((event as CustomEvent<BalanceFx>).detail)
  target.addEventListener(EVENT, handler)
  return () => target.removeEventListener(EVENT, handler)
}
