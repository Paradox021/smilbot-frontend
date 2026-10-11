import { PACK_VIEWBOX, packOutline, packTearClips } from './pack'

describe('pack', () => {
  it('el contorno es un trazado cerrado dentro del viewBox', () => {
    const outline = packOutline()
    expect(outline.startsWith('M0 0')).toBe(true)
    expect(outline.endsWith('Z')).toBe(true)
    const numbers = outline.match(/-?\d+(\.\d+)?/g)?.map(Number) ?? []
    expect(Math.max(...numbers)).toBeLessThanOrEqual(PACK_VIEWBOX.height)
    expect(Math.min(...numbers)).toBeGreaterThanOrEqual(0)
  })

  it('la solapa y el cuerpo comparten el mismo corte', () => {
    const { flap, body } = packTearClips()
    const edgeOf = (clip: string) =>
      clip
        .slice('polygon('.length, -1)
        .split(', ')
        .filter((point) => !point.includes('-10%') && !point.includes('110%'))
    expect(edgeOf(flap).reverse()).toEqual(edgeOf(body))
  })
})
