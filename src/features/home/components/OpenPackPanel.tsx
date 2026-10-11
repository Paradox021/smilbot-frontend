import { Link } from 'react-router'
import { ClaimOutcomeMessage, dailyTexts, type DailyClaimResult } from '@/features/daily'
import { PULL_COST } from '@/shared/config/economy'
import { ROUTES } from '@/shared/config/routes'
import { formatCountdown, formatNumber } from '@/shared/lib/format'
import { Button } from '@/shared/ui/button'
import { homeTexts as t } from '../texts'
import { PackStack } from './PackStack'

interface OpenPackPanelProps {
  availableAt: Date
  now: Date
  /** Daily recién reclamado, si lo hay: se celebra antes de invitar a abrir un sobre. */
  claimResult?: DailyClaimResult
}

/** Con el daily ya reclamado, la acción del día es abrir un sobre. */
export function OpenPackPanel({ availableAt, now, claimResult }: OpenPackPanelProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex min-w-0 flex-1 flex-col items-start gap-4">
        {claimResult ? (
          <ClaimOutcomeMessage result={claimResult} />
        ) : (
          <p className="text-body">{t.packPitch}</p>
        )}
        <Button asChild size="lg">
          <Link to={ROUTES.pull}>{t.openPack(formatNumber(PULL_COST))}</Link>
        </Button>
        <p className="text-sm text-muted-foreground">
          {dailyTexts.nextIn}{' '}
          <span role="timer" className="font-medium text-foreground tabular-nums">
            {formatCountdown(availableAt, now)}
          </span>
        </p>
      </div>
      <PackStack className="w-24 shrink-0 sm:w-36" />
    </div>
  )
}
