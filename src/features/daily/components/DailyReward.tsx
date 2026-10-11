import type { Ref } from 'react'
import { Coins, TriangleAlert } from 'lucide-react'
import { DAILY_REWARD } from '@/shared/config/economy'
import { formatNumber, formatRelativeTime } from '@/shared/lib/format'
import { Button } from '@/shared/ui/button'
import type { DailyStatus } from '../dailyStatus'
import { dailyTexts as t } from '../texts'

type AvailableStatus = Extract<DailyStatus, { kind: 'available' }>

interface DailyRewardProps {
  status: AvailableStatus
  now: Date
  pending: boolean
  onClaim: () => void
  /** Botón de reclamar: de ahí salen las monedas que vuelan al saldo. */
  buttonRef?: Ref<HTMLButtonElement>
}

function StreakNote({ status, now }: { status: AvailableStatus; now: Date }) {
  if (status.streakAtRisk && status.streakExpiresAt) {
    return (
      <p className="flex items-center gap-2 text-sm text-warning">
        <TriangleAlert aria-hidden className="size-4 shrink-0" />
        {t.streakAtRisk(
          formatNumber(status.streak),
          formatRelativeTime(status.streakExpiresAt, now),
        )}
      </p>
    )
  }
  if (status.streak > 0) {
    return (
      <p className="text-sm text-muted-foreground">
        {t.keepStreak(formatNumber(status.streak + 1))}
      </p>
    )
  }
  return null
}

/** Recompensa diaria disponible: la cantidad en grande y el botón de reclamar. */
export function DailyReward({ status, now, pending, onClaim, buttonRef }: DailyRewardProps) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex flex-col gap-2">
        <p className="flex items-center gap-2.5 font-heading text-5xl leading-none font-extrabold tabular-nums">
          <Coins aria-hidden className="size-9 text-primary" />
          {formatNumber(DAILY_REWARD)}
          <span className="sr-only"> {t.coins}</span>
          <span aria-hidden className="text-lg font-bold text-muted-foreground">
            {t.coins}
          </span>
        </p>
        <StreakNote status={status} now={now} />
      </div>
      <Button
        ref={buttonRef}
        size="lg"
        className="w-full sm:w-auto sm:min-w-40"
        onClick={onClaim}
        disabled={pending}
      >
        {pending ? t.claiming : t.claim}
      </Button>
    </div>
  )
}
