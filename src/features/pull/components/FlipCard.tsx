import { cn } from 'cn'
import { motion, type TargetAndTransition, type Transition } from 'motion/react'
import { CardBack, CardFront } from '@/features/cards'
import type { RevealTiming } from '../reveal'
import type { PullPhase } from '../sequence'
import type { PullResult } from '../types'
import { BACK_SIZE, CARD_SLOT } from './cardSlot'

interface FlipCardProps {
  phase: PullPhase
  card: PullResult | null
  timing: RevealTiming | null
  skipped: boolean
}

const SHUFFLE: TargetAndTransition = {
  rotateY: 0,
  rotateZ: [0, -4, 3, -2, 0],
  y: [0, -8, 0],
  scale: 1,
  transition: {
    rotateY: { duration: 0 },
    default: { duration: 0.9, ease: 'easeInOut', repeat: Infinity },
  },
}

function pose(
  phase: PullPhase,
  timing: RevealTiming | null,
  skipped: boolean,
): TargetAndTransition {
  if (phase === 'shuffling') return SHUFFLE

  const settle: Transition = { duration: 0.3, ease: 'easeOut' }
  if (phase === 'anticipation' && timing) {
    const beats = Array.from({ length: timing.pulses }, () => [1.04, 1]).flat()
    return {
      rotateY: 0,
      rotateZ: 0,
      y: 0,
      scale: [1, ...beats],
      transition: {
        default: settle,
        scale: { duration: timing.anticipationMs / 1000, ease: 'easeInOut' },
      },
    }
  }

  const faceUp = phase === 'revealing' || phase === 'result'
  return {
    rotateY: faceUp ? 180 : 0,
    rotateZ: 0,
    y: 0,
    scale: 1,
    transition: {
      default: settle,
      rotateY:
        faceUp && !skipped && timing
          ? { duration: timing.flipMs / 1000, ease: [0.65, 0, 0.35, 1] }
          : { duration: 0 },
    },
  }
}

const FACE = 'absolute inset-0 flex items-center justify-center'

/** Carta que se baraja, brilla y gira para mostrar su cara. */
export function FlipCard({ phase, card, timing, skipped }: FlipCardProps) {
  const backRarity = phase === 'anticipation' && card ? card.type : undefined
  // La cara solo existe en el DOM desde el giro: así ni un lector de pantalla la anticipa.
  const faceUp = phase === 'revealing' || phase === 'result'

  return (
    <div className={cn(CARD_SLOT, 'perspective-distant')}>
      <motion.div
        className="relative size-full transform-3d"
        animate={pose(phase, timing, skipped)}
      >
        <div className={cn(FACE, 'backface-hidden')}>
          <CardBack rarityType={backRarity} className={BACK_SIZE} />
        </div>
        {card && faceUp && (
          <div className={cn(FACE, 'rotate-y-180 backface-hidden')}>
            <CardFront
              card={card}
              overlay={timing?.holo && phase === 'result' ? <HoloShine /> : null}
            />
          </div>
        )}
      </motion.div>
    </div>
  )
}

function HoloShine() {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent_35%,rgb(255_255_255/0.3)_50%,transparent_65%)] mix-blend-overlay"
      initial={{ x: '-100%' }}
      animate={{ x: '100%' }}
      transition={{ duration: 2.4, ease: 'easeInOut', repeat: Infinity, repeatDelay: 1.2 }}
    />
  )
}
