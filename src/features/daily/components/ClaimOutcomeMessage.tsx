import { Flame, HeartCrack, Sparkles, Trophy } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { DAILY_REWARD } from '@/shared/config/economy'
import { formatNumber } from '@/shared/lib/format'
import { getClaimOutcome, type ClaimOutcome } from '../claimOutcome'
import { dailyTexts as t } from '../texts'
import type { DailyClaimResult } from '../types'

const OUTCOME_ICONS = {
  newRecord: Trophy,
  streakBroken: HeartCrack,
  streakContinues: Flame,
  streakStarted: Sparkles,
} as const

function outcomeText(outcome: ClaimOutcome): string {
  switch (outcome.kind) {
    case 'newRecord':
      return t.newRecord(formatNumber(outcome.streak))
    case 'streakBroken':
      return t.streakBroken(formatNumber(outcome.lostStreak))
    case 'streakContinues':
      return t.streakContinues(formatNumber(outcome.streak))
    case 'streakStarted':
      return t.streakStarted
  }
}

export function ClaimOutcomeMessage({ result }: { result: DailyClaimResult }) {
  const reduceMotion = useReducedMotion()
  const outcome = getClaimOutcome(result)
  const Icon = OUTCOME_ICONS[outcome.kind]

  return (
    <motion.div
      role="status"
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col gap-1"
    >
      <p className="font-heading text-2xl font-extrabold text-success tabular-nums">
        {t.reward(formatNumber(DAILY_REWARD))}
      </p>
      <p
        className={
          outcome.kind === 'newRecord'
            ? 'flex items-center gap-2 text-warning'
            : 'flex items-center gap-2 text-body'
        }
      >
        <Icon aria-hidden className="size-4" />
        {outcomeText(outcome)}
      </p>
    </motion.div>
  )
}
