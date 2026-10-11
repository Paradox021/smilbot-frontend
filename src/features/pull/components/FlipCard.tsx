import { cn } from 'cn'
import { motion, type TargetAndTransition } from 'motion/react'
import { CardBack, CardFront } from '@/features/cards'
import { EASE_OUT } from '@/shared/config/motion'
import { PACK_OPEN_MS, type RevealTiming } from '../reveal'
import type { PullPhase } from '../sequence'
import type { PullResult } from '../types'
import { BACK_SIZE, CARD_SLOT } from './cardSlot'

interface FlipCardProps {
  phase: PullPhase
  card: PullResult | null
  timing: RevealTiming | null
  skipped: boolean
}

const FLIP_EASE = [0.65, 0, 0.35, 1] as const

function pose(
  phase: PullPhase,
  timing: RevealTiming | null,
  skipped: boolean,
): TargetAndTransition {
  // Dentro del sobre: invisible hasta que se rasga, para que no asome por los bordes al temblar.
  if (phase === 'idle' || phase === 'shuffling' || phase === 'anticipation') {
    return { opacity: 0, y: 0, rotateY: 0, transition: { duration: 0 } }
  }
  if (phase === 'opening') {
    return {
      opacity: 1,
      y: '-14%',
      rotateY: 0,
      transition: {
        opacity: { duration: 0 },
        y: { duration: PACK_OPEN_MS / 1000, delay: 0.1, ease: EASE_OUT },
      },
    }
  }

  const animate = phase === 'revealing' && !skipped && timing
  return {
    opacity: 1,
    y: 0,
    rotateY: 180,
    transition: animate
      ? {
          y: { duration: (timing.flipMs / 1000) * 0.8, ease: EASE_OUT },
          rotateY: { duration: timing.flipMs / 1000, ease: FLIP_EASE },
        }
      : { duration: 0 },
  }
}

const FACE = 'absolute inset-0 flex items-center justify-center'

/** Carta que espera dentro del sobre, asoma al rasgarlo, sube y gira para mostrar su cara. */
export function FlipCard({ phase, card, timing, skipped }: FlipCardProps) {
  const backRarity = card && phase === 'opening' ? card.type : undefined
  // La cara solo existe en el DOM desde el giro: así ni un lector de pantalla la anticipa.
  const faceUp = phase === 'revealing' || phase === 'result'

  return (
    // Al girar pasa por delante del sobre, que cae: sin esto se transparentaría a través de él.
    <div
      aria-hidden={!faceUp || undefined}
      className={cn(CARD_SLOT, 'perspective-distant', faceUp && 'z-20')}
    >
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
