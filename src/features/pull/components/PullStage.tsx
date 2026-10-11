import { cn } from 'cn'
import { motion } from 'motion/react'
import { CardFront, PackArt } from '@/features/cards'
import { Button } from '@/shared/ui/button'
import { getRevealTiming } from '../reveal'
import { isAnimating, type PullSequenceState } from '../sequence'
import { pullTexts as t } from '../texts'
import { CARD_SLOT, PACK_SIZE } from './cardSlot'
import { FlipCard } from './FlipCard'
import { Pack } from './Pack'
import { RevealEffects } from './RevealEffects'

interface PullStageProps {
  state: PullSequenceState
  reducedMotion: boolean
  canTear: boolean
  onTear: () => void
  onSkip: () => void
}

/** Movimiento reducido: sin temblor, rasgado ni giro. El sobre se funde y aparece la carta. */
function StillStage({ state }: { state: PullSequenceState }) {
  const card = state.outcome?.result
  return (
    <div className={cn(CARD_SLOT, 'flex items-center justify-center')}>
      {state.phase === 'result' && card ? (
        <motion.div key={state.round} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <CardFront card={card} />
        </motion.div>
      ) : (
        <div role="img" aria-label={t.pack}>
          <PackArt className={PACK_SIZE} />
        </div>
      )}
    </div>
  )
}

/** Escenario de la tirada. Tocar en cualquier punto mientras se anima salta al resultado. */
export function PullStage({ state, reducedMotion, canTear, onTear, onSkip }: PullStageProps) {
  const { phase, outcome, skipped, round } = state
  const card = outcome?.result ?? null
  const timing = card ? getRevealTiming(card.type) : null
  const animating = isAnimating(phase)

  return (
    <div
      onClick={animating ? onSkip : undefined}
      className="relative flex w-full items-center justify-center overflow-x-clip py-4"
    >
      {reducedMotion ? (
        <StillStage state={state} />
      ) : (
        <>
          {card && timing && (
            <RevealEffects
              key={`effects-${round}`}
              phase={phase}
              rarityType={card.type}
              timing={timing}
              skipped={skipped}
            />
          )}
          <FlipCard phase={phase} card={card} timing={timing} skipped={skipped} />
          {/* Un sobre nuevo en cada tirada, con su entrada; el primero ya está en reposo. */}
          <Pack
            key={`pack-${Math.max(round, 1)}`}
            phase={phase}
            rarityType={card?.type ?? null}
            timing={timing}
            canTear={canTear}
            onTear={onTear}
          />
        </>
      )}

      {animating && (
        <Button variant="ghost" size="sm" onClick={onSkip} className="absolute top-0 right-0 z-20">
          {t.skip}
        </Button>
      )}
    </div>
  )
}
