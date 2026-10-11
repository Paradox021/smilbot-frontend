import { cn } from 'cn'
import { motion } from 'motion/react'
import { rarityStyle } from '@/features/cards'
import { PACK_OPEN_MS, type RevealTiming } from '../reveal'
import type { PullPhase } from '../sequence'
import { PACK_SIZE } from './cardSlot'

interface RevealEffectsProps {
  phase: PullPhase
  rarityType: number
  timing: RevealTiming
  skipped: boolean
}

const PARTICLE_ANGLES = Array.from({ length: 16 }, (_, index) => (index / 16) * Math.PI * 2)
const PARTICLE_DISTANCE = 190

const seconds = (ms: number) => ms / 1000

/** Trapecio que se abre hacia arriba desde la boca del sobre, algo más estrecho que el sobre. */
const BEAM_SHAPE = 'polygon(16% 100%, 84% 100%, 100% 0, 0 0)'

/**
 * Haz de luz que sale por la boca del sobre al rasgarlo; va detrás de la carta, que sube a través
 * de él. La caja tiene el tamaño del sobre para que el haz nazca justo en la línea de corte.
 */
function PackBeam({ phase, timing }: { phase: PullPhase; timing: RevealTiming }) {
  return (
    <div className={cn('absolute aspect-5/7', PACK_SIZE)}>
      <motion.div
        className="absolute -inset-x-[12%] bottom-[84.3%] h-[40%] origin-bottom bg-linear-to-t from-white/80 via-(--rarity) via-25% to-transparent blur-md"
        style={{ clipPath: BEAM_SHAPE }}
        initial={{ opacity: 0, scaleY: 0.1 }}
        animate={phase === 'opening' ? { opacity: 0.75, scaleY: 1 } : { opacity: 0, scaleY: 1.15 }}
        transition={{
          duration: phase === 'opening' ? PACK_OPEN_MS / 1000 : seconds(timing.flipMs * 0.7),
          ease: 'easeOut',
        }}
      />
    </div>
  )
}

/**
 * Luz de la carta una vez sale del sobre: haz, brillo, rayos, destello, partículas y tinte. La luz
 * de antes de abrir vive en el propio sobre (`Pack`). Solo `transform` y `opacity`.
 */
export function RevealEffects({ phase, rarityType, timing, skipped }: RevealEffectsProps) {
  const revealed = phase === 'revealing' || phase === 'result'
  const lit = phase === 'opening' || revealed
  const burst = revealed && !skipped
  const burstDelay = seconds(timing.flipMs * 0.45)

  return (
    <div
      aria-hidden
      style={rarityStyle(rarityType)}
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
    >
      {timing.pulses > 0 && lit && !skipped && <PackBeam phase={phase} timing={timing} />}

      {timing.tint && (
        <motion.div
          className="absolute inset-x-0 -inset-y-24 bg-[radial-gradient(closest-side,var(--rarity),transparent)] mix-blend-screen"
          initial={{ opacity: 0 }}
          animate={{
            opacity: phase === 'anticipation' ? 0.12 : lit ? 0.18 : 0,
          }}
          transition={{ duration: seconds(phase === 'anticipation' ? timing.anticipationMs : 600) }}
        />
      )}

      {timing.rays && revealed && (
        <motion.div
          className="absolute aspect-square w-[min(30rem,100%)] bg-[repeating-conic-gradient(var(--rarity)_0deg_5deg,transparent_5deg_22deg)] mask-[radial-gradient(closest-side,black,transparent)]"
          initial={{ opacity: 0, rotate: 0 }}
          animate={{ opacity: 0.35, rotate: 360 }}
          transition={{
            opacity: { duration: 0.6, delay: skipped ? 0 : burstDelay },
            rotate: { duration: 24, ease: 'linear', repeat: Infinity },
          }}
        />
      )}

      {timing.pulses > 0 && (
        <motion.div
          className="absolute aspect-square w-[min(22rem,100%)] rounded-full bg-[radial-gradient(closest-side,var(--rarity),transparent)]"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: lit ? 0.5 : 0, scale: lit ? 1 : 0.6 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      )}

      {timing.flash && burst && (
        <motion.div
          className="absolute aspect-square w-[min(26rem,100%)] rounded-full bg-[radial-gradient(closest-side,white,var(--rarity)_45%,transparent)]"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: [0, 0.85, 0], scale: [0.6, 1.1, 1.3] }}
          transition={{ duration: 0.7, delay: burstDelay, ease: 'easeOut' }}
        />
      )}

      {timing.particles &&
        burst &&
        PARTICLE_ANGLES.map((angle) => (
          <motion.span
            key={angle}
            className="absolute size-1.5 rounded-full bg-(--rarity)"
            initial={{ opacity: 0, x: 0, y: 0, scale: 0.5 }}
            animate={{
              opacity: [0, 1, 0],
              x: Math.cos(angle) * PARTICLE_DISTANCE,
              y: Math.sin(angle) * PARTICLE_DISTANCE,
              scale: [0.5, 1.2, 0.4],
            }}
            transition={{ duration: 1.2, delay: burstDelay, ease: 'easeOut' }}
          />
        ))}
    </div>
  )
}
