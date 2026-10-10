import { getLuckTier } from '@/shared/config/luckTiers'
import { formatNumber, formatPercent } from '@/shared/lib/format'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { hasLuckData } from '@/features/stats'
import { profileTexts as t } from '../texts'
import type { LuckStats } from '@/features/stats'
import { ProfileStat } from './ProfileStat'
import { RarityBreakdown } from './RarityBreakdown'

export function LuckCard({ luck }: { luck: LuckStats }) {
  const tier = getLuckTier(luck.tierCode)

  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>{t.luckTitle}</CardTitle>
        {hasLuckData(luck) && (
          <CardDescription className="flex items-center gap-2 text-base text-foreground">
            {tier && <tier.icon aria-hidden className="size-4 text-muted-foreground" />}
            {tier?.name ?? luck.tier}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {hasLuckData(luck) ? (
          <>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-3">
              <ProfileStat label={t.luckPercentage} value={formatPercent(luck.luckPercentage)} />
              <ProfileStat
                label={t.luckDelta}
                value={formatPercent(luck.luckPercentage - 100, { signed: true })}
              />
              <ProfileStat label={t.evaluatedCards} value={formatNumber(luck.totalCards)} />
            </dl>
            <p className="text-sm text-body">
              {luck.eligibleForLeaderboard ? t.eligibleForLeaderboard : t.notEligibleForLeaderboard}
            </p>
            <RarityBreakdown breakdown={luck.breakdown} />
          </>
        ) : (
          <p className="text-sm text-muted-foreground">{t.luckEmpty}</p>
        )}
      </CardContent>
    </Card>
  )
}
