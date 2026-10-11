import { useId } from 'react'
import { Link } from 'react-router'
import { rarityStyle } from '@/features/cards'
import { getPityProgress, type PityStats } from '@/features/stats'
import { PULL_COST } from '@/shared/config/economy'
import { ROUTES } from '@/shared/config/routes'
import { formatNumber } from '@/shared/lib/format'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Progress } from '@/shared/ui/progress'
import { homeTexts as t } from '../texts'

const MYTHIC = 4

interface GuaranteeCardProps {
  pity: PityStats
  /** Acceso secundario a la tirada, cuando la acción del día es el daily. */
  showPackLink: boolean
}

/** Cuántos sobres faltan para la mítica garantizada, con un medidor del color mítico. */
export function GuaranteeCard({ pity, showPackLink }: GuaranteeCardProps) {
  const labelId = useId()
  const remaining = pity.pullsUntilGuaranteed

  return (
    <Card style={rarityStyle(MYTHIC)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span aria-hidden className="size-2.5 rounded-full bg-(--rarity)" />
          {t.pityTitle}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <p className="font-heading text-3xl font-extrabold tabular-nums">
          {remaining <= 0 ? t.pityNext : t.pullsUntilGuaranteed(remaining, formatNumber(remaining))}
        </p>
        <span id={labelId} className="sr-only">
          {t.pityProgressLabel}
        </span>
        <Progress
          value={getPityProgress(pity)}
          aria-labelledby={labelId}
          className="h-2.5"
          indicatorClassName="rounded-full bg-linear-to-r from-(--rarity)/45 to-(--rarity)"
        />
        <p className="text-sm text-muted-foreground tabular-nums">
          {t.pityProgress(
            formatNumber(pity.pullsSinceLastMythic),
            formatNumber(pity.pityThreshold),
          )}
        </p>
        {showPackLink && (
          <Button asChild variant="secondary" className="mt-1 self-start">
            <Link to={ROUTES.pull}>{t.openPackSecondary(formatNumber(PULL_COST))}</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
