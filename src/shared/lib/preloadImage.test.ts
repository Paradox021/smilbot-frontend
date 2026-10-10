import { preloadImage } from './preloadImage'

describe('preloadImage', () => {
  afterEach(() => vi.useRealTimers())

  it('sin URL se resuelve al momento', async () => {
    await expect(preloadImage(undefined)).resolves.toBeUndefined()
  })

  it('si la imagen no responde, se resuelve al pasar el tiempo límite', async () => {
    vi.useFakeTimers()
    let settled = false
    const promise = preloadImage('https://img.test/lenta.png', 500).then(() => {
      settled = true
    })

    await vi.advanceTimersByTimeAsync(499)
    expect(settled).toBe(false)
    await vi.advanceTimersByTimeAsync(1)
    await promise
    expect(settled).toBe(true)
  })
})
