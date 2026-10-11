import { cn } from 'cn'
import { motion, type TargetAndTransition } from 'motion/react'
import { PackArt, packTearClips, rarityStyle } from '@/features/cards'
import { DURATION, EASE_OUT } from '@/shared/config/motion'
import { useSwipeToTear } from '../hooks/useSwipeToTear'
import { getGlowKeyframes, PACK_OPEN_MS, type RevealTiming } from '../reveal'
import type { PullPhase } from '../sequence'
import { pullTexts as t } from '../texts'
import { PACK_SIZE } from './cardSlot'

interface PackProps {
  phase: PullPhase
  rarityType: number | null
  timing: RevealTiming | null
  /** Se puede rasgar deslizando el dedo (sobre en reposo y saldo suficiente). */
  canTear: boolean
  onTear: () => void
}

const CLIPS = packTearClips()
const OPEN_S = PACK_OPEN_MS / 1000
/** Altura de la línea de corte en el sobre (`PACK_TEAR_Y` / alto del viewBox). */
const TEAR_LINE = 'top-[15.7%]'

const seconds = (ms: number) => ms / 1000

function packPose(phase: PullPhase, timing: RevealTiming | null): TargetAndTransition {
  const rest = { x: 0, rotate: 0, scale: 1, opacity: 1 }
  switch (phase) {
    case 'idle':
      // Respiración: el único bucle de la app (se quita con movimiento reducido).
      return {
        ...rest,
        y: [0, -6, 0],
        transition: {
          y: { duration: 3.2, ease: 'easeInOut', repeat: Infinity },
          default: { duration: DURATION.base },
        },
      }
    case 'shuffling':
      return {
        ...rest,
        y: 0,
        rotate: [0, -3, 3, -2, 2, 0],
        x: [0, -3, 3, -2, 2, 0],
        transition: { duration: 0.45, ease: 'easeInOut', repeat: Infinity },
      }
    case 'anticipation': {
      const beats = Array.from({ length: timing?.pulses ?? 0 }, () => [1.04, 1]).flat()
      return {
        ...rest,
        y: 0,
        scale: [1, ...beats],
        transition: {
          default: { duration: DURATION.base },
          scale: { duration: seconds(timing?.anticipationMs ?? 0), ease: 'easeInOut' },
        },
      }
    }
    case 'opening':
      return { ...rest, y: [0, 5, 0], transition: { duration: OPEN_S, ease: EASE_OUT } }
    case 'revealing':
      return {
        ...rest,
        y: 110,
        opacity: 0,
        transition: { duration: seconds((timing?.flipMs ?? 600) * 0.55), ease: 'easeIn' },
      }
    case 'result':
      return { ...rest, y: 110, opacity: 0, transition: { duration: 0 } }
  }
}

function flapPose(phase: PullPhase): TargetAndTransition {
  if (phase === 'opening') {
    return {
      x: 70,
      y: -110,
      rotate: 32,
      opacity: 0,
      transition: { duration: OPEN_S, ease: [0.3, 0, 0.4, 1], opacity: { delay: OPEN_S * 0.5 } },
    }
  }
  if (phase === 'revealing' || phase === 'result') {
    return { x: 70, y: -110, rotate: 32, opacity: 0, transition: { duration: 0 } }
  }
  return { x: 0, y: 0, rotate: 0, opacity: 1, transition: { duration: 0 } }
}

function TearLight({ phase, timing }: { phase: PullPhase; timing: RevealTiming }) {
  const anticipating = phase === 'anticipation'
  const opening = phase === 'opening'

  return (
    <>
      <motion.div
        aria-hidden
        className={cn(
          'pointer-events-none absolute -inset-x-[8%] h-8 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,white,var(--rarity)_35%,transparent)]',
          TEAR_LINE,
        )}
        initial={{ opacity: 0, scaleY: 0.4 }}
        animate={
          anticipating
            ? { opacity: getGlowKeyframes(timing.pulses), scaleY: 1 }
            : opening
              ? { opacity: [0.9, 1, 0], scaleY: [1, 2.2, 3] }
              : { opacity: 0, scaleY: 1 }
        }
        transition={{
          duration: anticipating ? seconds(timing.anticipationMs) : OPEN_S,
          ease: 'easeInOut',
        }}
      />
      {opening && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-x-[12%] bottom-[84.3%] h-[70%] origin-bottom bg-linear-to-t from-(--rarity) to-transparent mask-x-from-60%"
          initial={{ opacity: 0, scaleY: 0.3 }}
          animate={{ opacity: [0, 0.8, 0], scaleY: 1 }}
          transition={{ duration: OPEN_S * 1.6, ease: 'easeOut' }}
        />
      )}
    </>
  )
}

/** Sobre de Smilbot que respira, tiembla, deja escapar la luz de la rareza y se rasga. */
export function Pack({ phase, rarityType, timing, canTear, onTear }: PackProps) {
  const swipe = useSwipeToTear(canTear && phase === 'idle', onTear)

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
      <motion.div
        role="img"
        aria-label={t.pack}
        style={rarityType === null ? undefined : rarityStyle(rarityType)}
        className={cn('pointer-events-auto relative aspect-5/7 touch-pan-y', PACK_SIZE)}
        initial={{ opacity: 0, y: 24 }}
        animate={packPose(phase, timing)}
        {...swipe}
      >
        <div className="absolute inset-0 drop-shadow-[0_18px_30px_rgb(0_0_0/0.45)]">
          <div className="absolute inset-0" style={{ clipPath: CLIPS.body }}>
            <PackArt className="size-full" />
          </div>
        </div>
        <motion.div
          className="absolute inset-0 origin-[20%_16%]"
          style={{ clipPath: CLIPS.flap }}
          animate={flapPose(phase)}
        >
          <PackArt className="size-full" />
        </motion.div>
        {timing && timing.pulses > 0 && <TearLight phase={phase} timing={timing} />}
      </motion.div>
    </div>
  )
}
