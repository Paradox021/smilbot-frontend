/** Geometría del sobre (`PackArt`), en unidades de su `viewBox`. Proporción 5:7. */
export const PACK_VIEWBOX = { width: 100, height: 140 } as const

/** Altura de la línea de corte: lo que queda por encima es la solapa que se rasga. */
export const PACK_TEAR_Y = 22

const CRIMP_TEETH = 14
const CRIMP_DEPTH = 2.5

function zigzag(y: number, direction: 1 | -1, fromLeft: boolean): string[] {
  const { width } = PACK_VIEWBOX
  const step = width / CRIMP_TEETH
  const points: string[] = []
  for (let tooth = 0; tooth <= CRIMP_TEETH * 2; tooth++) {
    const x = fromLeft ? (tooth * step) / 2 : width - (tooth * step) / 2
    points.push(`${round(x)} ${round(tooth % 2 === 0 ? y : y + CRIMP_DEPTH * direction)}`)
  }
  return points
}

const round = (value: number) => Math.round(value * 100) / 100

/** Contorno del sobre con los bordes de arriba y abajo dentados, como un sobre prensado. */
export function packOutline(): string {
  const { height } = PACK_VIEWBOX
  const top = zigzag(0, 1, true)
  const bottom = zigzag(height, -1, false)
  return `M${top.join(' L')} L${bottom.join(' L')} Z`
}

const TEAR_TEETH = 9
const TEAR_DEPTH = 1.6

/**
 * Corte irregular a lo largo de la línea de corte, de izquierda a derecha, en porcentajes del sobre.
 * Lo comparten la solapa y el cuerpo para que encajen.
 */
function tearEdge(): string[] {
  const y = (PACK_TEAR_Y / PACK_VIEWBOX.height) * 100
  return Array.from({ length: TEAR_TEETH * 2 + 1 }, (_, index) => {
    const x = (index / (TEAR_TEETH * 2)) * 100
    const offset = index % 2 === 0 ? 0 : index % 4 === 1 ? TEAR_DEPTH : -TEAR_DEPTH
    return `${round(x)}% ${round(y + offset)}%`
  })
}

/** `clip-path` de la solapa (lo que hay por encima del corte) y del cuerpo (lo de debajo). */
export function packTearClips(): { flap: string; body: string } {
  const edge = tearEdge()
  return {
    flap: `polygon(0% -10%, 100% -10%, ${[...edge].reverse().join(', ')})`,
    body: `polygon(${edge.join(', ')}, 100% 110%, 0% 110%)`,
  }
}
