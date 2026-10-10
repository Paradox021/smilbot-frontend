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
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between gap-2 text-sm">
            <span id={labelId} className="text-body">
              {t.pityProgressLabel}
            </span>
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
        <p className="text-sm text-body">
          {t.pityMythicsCount}:{' '}
          <span className="font-medium text-foreground tabular-nums">
            {formatNumber(pity.pityMythicsCount)}
          </span>
        </p>
      </CardContent>
    </Card>
  )
}
