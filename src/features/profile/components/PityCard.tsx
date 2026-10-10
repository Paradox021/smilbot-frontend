import { useId } from 'react'
import { formatNumber } from '@/shared/lib/format'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Progress } from '@/shared/ui/progress'
import { getPityProgress } from '../stats'
import { profileTexts as t } from '../texts'
import type { PityStats } from '../types'

export function PityCard({ pity }: { pity: PityStats }) {
  const labelId = useId()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.pityTitle}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between gap-2 text-sm">
            <span id={labelId}>{t.pityProgressLabel}</span>
            <span className="tabular-nums">
              {t.pityProgress(
                formatNumber(pity.pullsSinceLastMythic),
                formatNumber(pity.pityThreshold),
              )}
            </span>
          </div>
          <Progress value={getPityProgress(pity)} aria-labelledby={labelId} />
        </div>
        <p className="text-sm text-muted-foreground">
          {t.pullsUntilGuaranteed(formatNumber(pity.pullsUntilGuaranteed))}
        </p>
        <p className="text-sm">
          {t.pityMythicsCount}:{' '}
          <span className="font-semibold tabular-nums">{formatNumber(pity.pityMythicsCount)}</span>
        </p>
      </CardContent>
    </Card>
  )
}
