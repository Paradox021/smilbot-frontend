import { useId } from 'react'
import { Link } from 'react-router'
import { getPityProgress, type PityStats } from '@/features/stats'
import { PULL_COST } from '@/shared/config/economy'
import { ROUTES } from '@/shared/config/routes'
import { formatNumber } from '@/shared/lib/format'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Progress } from '@/shared/ui/progress'
import { homeTexts as t } from '../texts'

/** Resumen del pity (cuántos sobres faltan para la mítica garantizada) y acceso a la tirada. */
export function GuaranteeCard({ pity }: { pity: PityStats }) {
  const labelId = useId()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.pityTitle}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <p className="text-3xl font-medium tabular-nums">
          {t.pullsUntilGuaranteed(formatNumber(pity.pullsUntilGuaranteed))}
        </p>
        <span id={labelId} className="sr-only">
          {t.pityProgressLabel}
        </span>
        <Progress value={getPityProgress(pity)} aria-labelledby={labelId} />
        <p className="text-sm text-muted-foreground tabular-nums">
          {t.pityProgress(
            formatNumber(pity.pullsSinceLastMythic),
            formatNumber(pity.pityThreshold),
          )}
        </p>
        <Button asChild variant="secondary" className="mt-2 self-start">
          <Link to={ROUTES.pull}>{t.openPack(formatNumber(PULL_COST))}</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
