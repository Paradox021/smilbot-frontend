import { useId } from 'react'
import { cn } from 'cn'
import { PACK_TEAR_Y, PACK_VIEWBOX, packOutline } from '../pack'

const PAW_PATH =
  'M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z'

/** Huella de Lucide (`PawPrint`) rellena, en un cuadro de 24×24. */
function Paw({ x, y, size, opacity = 1, rotate = 0 }: PawProps) {
  return (
    <g
      transform={`translate(${x} ${y}) rotate(${rotate} ${size / 2} ${size / 2}) scale(${size / 24})`}
      opacity={opacity}
    >
      <circle cx="11" cy="4" r="2" />
      <circle cx="18" cy="8" r="2" />
      <circle cx="20" cy="16" r="2" />
      <path d={PAW_PATH} />
    </g>
  )
}

interface PawProps {
  x: number
  y: number
  size: number
  opacity?: number
  rotate?: number
}

const DECOR_PAWS: PawProps[] = [
  { x: 10, y: 34, size: 12, opacity: 0.1, rotate: -20 },
  { x: 74, y: 30, size: 14, opacity: 0.08, rotate: 25 },
  { x: 8, y: 100, size: 13, opacity: 0.08, rotate: 15 },
  { x: 78, y: 104, size: 11, opacity: 0.1, rotate: -30 },
]

/**
 * Sobre de Smilbot: objeto de marca (no es una carta), así que va en naranja y con brillo de papel
 * metalizado, la única excepción a "sin degradados de marca". Proporción 5:7. Ver DESIGN.md, "El sobre".
 */
export function PackArt({ className }: { className?: string }) {
  const id = useId()
  const fill = `${id}-fill`
  const sheen = `${id}-sheen`
  const crimp = `${id}-crimp`
  const { width, height } = PACK_VIEWBOX

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden
      className={cn('block aspect-5/7 overflow-visible', className)}
    >
      <defs>
        <linearGradient id={fill} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" style={{ stopColor: '#ffc48c' }} />
          <stop offset="0.45" style={{ stopColor: 'var(--primary)' }} />
          <stop offset="1" style={{ stopColor: 'var(--primary-pressed)' }} />
        </linearGradient>
        <linearGradient id={sheen} x1="0" y1="0" x2="1" y2="0.6">
          <stop offset="0.3" stopColor="white" stopOpacity="0" />
          <stop offset="0.45" stopColor="white" stopOpacity="0.35" />
          <stop offset="0.52" stopColor="white" stopOpacity="0.05" />
          <stop offset="0.6" stopColor="white" stopOpacity="0.2" />
          <stop offset="0.72" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <pattern id={crimp} width="2.5" height="10" patternUnits="userSpaceOnUse">
          <rect width="1" height="10" fill="black" opacity="0.12" />
        </pattern>
      </defs>

      <path d={packOutline()} fill={`url(#${fill})`} />

      {/* Cierres prensados arriba y abajo */}
      <rect y="3" width={width} height="9" fill={`url(#${crimp})`} />
      <rect y={height - 12} width={width} height="9" fill={`url(#${crimp})`} />

      <g style={{ fill: 'var(--primary-foreground)' }}>
        {DECOR_PAWS.map((paw) => (
          <Paw key={`${paw.x}-${paw.y}`} {...paw} />
        ))}
        <Paw x={29} y={40} size={42} />
        <text
          x={width / 2}
          y="102"
          textAnchor="middle"
          className="font-heading"
          fontSize="15"
          fontWeight="800"
        >
          Smilbot
        </text>
      </g>

      {/* Línea de corte: por aquí se rasga el sobre */}
      <line
        x1="4"
        x2={width - 4}
        y1={PACK_TEAR_Y}
        y2={PACK_TEAR_Y}
        strokeDasharray="2.5 2"
        strokeWidth="0.8"
        style={{ stroke: 'var(--primary-foreground)' }}
        opacity="0.35"
      />
      <path
        d={`M0 ${PACK_TEAR_Y - 2.5} L3.5 ${PACK_TEAR_Y} L0 ${PACK_TEAR_Y + 2.5} Z`}
        style={{ fill: 'var(--primary-foreground)' }}
        opacity="0.35"
      />

      <path d={packOutline()} fill={`url(#${sheen})`} />
    </svg>
  )
}
