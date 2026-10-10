import { useId } from 'react'
import { TriangleAlert } from 'lucide-react'
import type { UserStats } from '@/features/stats'
import { DAILY_REWARD } from '@/shared/config/economy'
import { useNow } from '@/shared/hooks/useNow'
import { formatCountdown, formatNumber, formatRelativeTime } from '@/shared/lib/format'
import { isApiError } from '@/shared/lib/http'
import { Button } from '@/shared/ui/button'
import { Card, CardContent } from '@/shared/ui/card'
import { getDailyStatus, type DailyStatus } from '../dailyStatus'
import { useClaimDailyMutation } from '../queries'
import { dailyTexts as t } from '../texts'
import { ClaimOutcomeMessage } from './ClaimOutcomeMessage'

const reward = formatNumber(DAILY_REWARD)

function claimErrorText(error: unknown): string {
  return isApiError(error) && error.status === 400 ? t.cooldownError : t.claimError
}

function AvailableNotes({
  status,
  now,
}: {
  status: Extract<DailyStatus, { kind: 'available' }>
  now: Date
}) {
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

export function DailyCard({ stats }: { stats: UserStats }) {
  const titleId = useId()
  const now = useNow()
  const claim = useClaimDailyMutation(stats.discordId)
  const status = getDailyStatus(stats, now)

  return (
    <Card aria-labelledby={titleId} role="region" className="bg-secondary">
      <CardContent className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2">
          <h2 id={titleId} className="text-lg font-medium tracking-[0.2px]">
            {t.title}
          </h2>
          {status.kind === 'available' ? (
            <>
              <p className="text-body">{t.available(reward)}</p>
              <AvailableNotes status={status} now={now} />
            </>
          ) : (
            claim.data && <ClaimOutcomeMessage result={claim.data} />
          )}
          {claim.isError && (
            <p role="alert" className="text-sm text-destructive">
              {claimErrorText(claim.error)}
            </p>
          )}
        </div>

        {status.kind === 'available' ? (
          <Button
            size="lg"
            className="w-full md:w-auto"
            onClick={() => claim.mutate()}
            disabled={claim.isPending}
          >
            {claim.isPending ? t.claiming : t.claim(reward)}
          </Button>
        ) : (
          <div className="flex flex-col gap-1 md:items-end">
            <span className="text-sm text-muted-foreground">{t.nextIn}</span>
            <span role="timer" className="text-3xl font-medium tabular-nums">
              {formatCountdown(status.availableAt, now)}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
