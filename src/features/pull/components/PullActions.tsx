import { Link } from 'react-router'
import { PULL_COST } from '@/shared/config/economy'
import { ROUTES } from '@/shared/config/routes'
import { formatNumber } from '@/shared/lib/format'
import { Button } from '@/shared/ui/button'
import type { PullPhase } from '../sequence'
import { pullTexts as t } from '../texts'

interface PullActionsProps {
  phase: PullPhase
  balance: number
  errorText: string | null
  onOpen: () => void
}

const cost = formatNumber(PULL_COST)

function buttonLabel(phase: PullPhase): string {
  if (phase === 'idle') return t.open(cost)
  if (phase === 'result') return t.openAnother(cost)
  return t.opening
}

export function PullActions({ phase, balance, errorText, onOpen }: PullActionsProps) {
  const busy = phase !== 'idle' && phase !== 'result'
  const shortfall = Math.max(0, PULL_COST - balance)

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <Button
        size="lg"
        className="w-full max-w-xs"
        disabled={shortfall > 0 && !busy}
        // Mientras se anima, el botón sigue enfocable (no `disabled`) para no perder el foco.
        aria-disabled={busy || undefined}
        onClick={busy ? undefined : onOpen}
      >
        {buttonLabel(phase)}
      </Button>
      {shortfall > 0 && !busy && (
        <p className="text-sm text-muted-foreground">
          {t.shortfall(formatNumber(shortfall))}{' '}
          <Link
            to={ROUTES.dashboard}
            className="text-foreground underline underline-offset-4 hover:no-underline"
          >
            {t.claimDailyHint}
          </Link>
        </p>
      )}
      {errorText && (
        <p role="alert" className="text-sm text-destructive">
          {errorText}
        </p>
      )}
    </div>
  )
}
