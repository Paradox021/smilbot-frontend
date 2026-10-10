import { cn } from 'cn'
import { useReducedMotion } from 'motion/react'
import { getRarityName } from '@/features/cards'
import type { UserStats } from '@/features/stats'
import { formatNumber } from '@/shared/lib/format'
import { usePullSequence } from '../hooks/usePullSequence'
import { getPullErrorText } from '../pullError'
import { usePullMutation } from '../queries'
import { pullTexts as t } from '../texts'
import type { PullOutcome } from '../types'
import { PullActions } from './PullActions'
import { PullResultDetails } from './PullResultDetails'
import { PullStage } from './PullStage'

function guaranteeText(remaining: number): string {
  return remaining <= 0 ? t.guaranteedNext : t.guaranteedIn(remaining, formatNumber(remaining))
}

function announcement(outcome: PullOutcome): string {
  const { name, type } = outcome.result
  const text = t.announce(name, getRarityName(type))
  return outcome.isNew ? `${text} ${t.announceNew}` : text
}

export function PullExperience({ stats }: { stats: UserStats }) {
  const reducedMotion = useReducedMotion() ?? false
  const pull = usePullMutation(stats.discordId)
  const { state, animating, start, resolve, fail, skip } = usePullSequence()
  const { phase, outcome } = state
  const showResult = phase === 'result' && outcome !== null

  const open = () => {
    start()
    pull.mutate(undefined, {
      onSuccess: (resolved) => resolve(resolved, reducedMotion),
      onError: fail,
    })
  }

  const remaining = showResult ? outcome.result.pity.remaining : stats.pity.pullsUntilGuaranteed

  return (
    <section className="flex flex-1 flex-col items-center text-center">
      <h1 className="text-3xl font-extrabold md:text-4xl">{t.title}</h1>
      <p
        className={cn('mt-2 text-sm text-muted-foreground tabular-nums', animating && 'invisible')}
      >
        {guaranteeText(remaining)}
      </p>

      <PullStage state={state} reducedMotion={reducedMotion} onSkip={skip} />

      <div className="mb-4 flex min-h-36 w-full flex-col items-center">
        {showResult && <PullResultDetails key={state.round} outcome={outcome} />}
      </div>

      <PullActions
        phase={phase}
        balance={stats.balance}
        errorText={phase === 'idle' && pull.isError ? getPullErrorText(pull.error) : null}
        onOpen={open}
      />

      <p aria-live="polite" className="sr-only">
        {showResult ? announcement(outcome) : ''}
      </p>
    </section>
  )
}
