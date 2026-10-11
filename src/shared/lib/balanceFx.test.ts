import { emitBalanceFx, onBalanceFx, type BalanceFx } from './balanceFx'

describe('balanceFx', () => {
  it('entrega los efectos a quien escucha hasta que deja de escuchar', () => {
    const received: BalanceFx[] = []
    const stop = onBalanceFx((fx) => received.push(fx))

    emitBalanceFx({ kind: 'spend', amount: 100 })
    stop()
    emitBalanceFx({ kind: 'gain', amount: 100 })

    expect(received).toEqual([{ kind: 'spend', amount: 100 }])
  })
})
