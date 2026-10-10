import { cn } from 'cn'
import { motion } from 'motion/react'
import { CardBack, CardFront } from '@/features/cards'
import { Button } from '@/shared/ui/button'
import { getRevealTiming } from '../reveal'
import { isAnimating, type PullSequenceState } from '../sequence'
import { pullTexts as t } from '../texts'
import { BACK_SIZE, CARD_SLOT } from './cardSlot'
import { FlipCard } from './FlipCard'
import { RevealEffects } from './RevealEffects'

interface PullStageProps {
  state: PullSequenceState
  reducedMotion: boolean
  onSkip: () => void
}

/** Escenario de la tirada. Tocar en cualquier punto mientras se anima salta al resultado. */
export function PullStage({ state, reducedMotion, onSkip }: PullStageProps) {
  const { phase, outcome, skipped, round } = state
  const card = outcome?.result ?? null
  const timing = card ? getRevealTiming(card.type) : null
  const animating = isAnimating(phase)

  return (
    <div
      onClick={animating ? onSkip : undefined}
      className="relative flex w-full items-center justify-center overflow-x-clip py-6"
    >
      {reducedMotion ? (
        <div className={cn(CARD_SLOT, 'flex items-center justify-center')}>
          {phase === 'result' && card ? (
            <motion.div key={round} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <CardFront card={card} />
            </motion.div>
          ) : (
            <CardBack className={BACK_SIZE} />
          )}
        </div>
      ) : (
        <>
          {card && timing && (
            <RevealEffects
              key={round}
              phase={phase}
              rarityType={card.type}
              timing={timing}
              skipped={skipped}
            />
          )}
          <FlipCard phase={phase} card={card} timing={timing} skipped={skipped} />
        </>
      )}

      {animating && (
        <Button variant="ghost" size="sm" onClick={onSkip} className="absolute top-0 right-0">
          {t.skip}
        </Button>
      )}
    </div>
  )
}
