import { motion } from 'motion/react'
import { rarityStyle } from '@/features/cards'
import { getGlowKeyframes, type RevealTiming } from '../reveal'
import type { PullPhase } from '../sequence'

interface RevealEffectsProps {
  phase: PullPhase
  rarityType: number
  timing: RevealTiming
  skipped: boolean
}

const PARTICLE_ANGLES = Array.from({ length: 16 }, (_, index) => (index / 16) * Math.PI * 2)
const PARTICLE_DISTANCE = 190

const seconds = (ms: number) => ms / 1000

/** Brillo, rayos, destello, partículas y tinte del fondo. Solo `transform` y `opacity`. */
export function RevealEffects({ phase, rarityType, timing, skipped }: RevealEffectsProps) {
  const revealed = phase === 'revealing' || phase === 'result'
  /** Ya se ha anunciado la rareza: el brillo se mantiene mientras se rasga el sobre. */
  const lit = phase === 'opening' || revealed
  const burst = revealed && !skipped
  const burstDelay = seconds(timing.flipMs * 0.45)

  return (
    <div
      aria-hidden
      style={rarityStyle(rarityType)}
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
    >
      {timing.tint && (
        <motion.div
          className="fixed inset-0 bg-[radial-gradient(circle_at_50%_45%,var(--rarity),transparent_65%)] mix-blend-screen"
          initial={{ opacity: 0 }}
          animate={{
            opacity: phase === 'anticipation' || phase === 'opening' ? 0.3 : revealed ? 0.14 : 0,
          }}
          transition={{ duration: seconds(phase === 'anticipation' ? timing.anticipationMs : 600) }}
        />
      )}

      {timing.rays && revealed && (
        <motion.div
          className="absolute size-[30rem] bg-[repeating-conic-gradient(var(--rarity)_0deg_5deg,transparent_5deg_22deg)] mask-[radial-gradient(closest-side,black,transparent)]"
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
          className="absolute size-[22rem] rounded-full bg-[radial-gradient(closest-side,var(--rarity),transparent)]"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={
            phase === 'anticipation'
              ? { opacity: getGlowKeyframes(timing.pulses), scale: 1 }
              : { opacity: lit ? 0.55 : 0, scale: 1 }
          }
          transition={{
            duration: seconds(phase === 'anticipation' ? timing.anticipationMs : 400),
            ease: 'easeInOut',
          }}
        />
      )}

      {timing.flash && burst && (
        <motion.div
          className="absolute size-[26rem] rounded-full bg-[radial-gradient(closest-side,white,var(--rarity)_45%,transparent)]"
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
