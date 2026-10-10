import { Flame } from 'lucide-react'
import type { UserStats } from '@/features/stats'
import { formatNumber } from '@/shared/lib/format'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { homeTexts as t } from '../texts'

export function StreakCard({ stats }: { stats: UserStats }) {
  const hasStreak = stats.dailyStreak > 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.streakTitle}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {hasStreak ? (
          <p className="flex items-center gap-2 text-3xl font-medium tabular-nums">
            <Flame aria-hidden className="size-6 text-warning" />
            {t.streakDays(formatNumber(stats.dailyStreak))}
          </p>
        ) : (
          <p className="text-body">{t.streakNone}</p>
        )}
        <p className="text-sm text-muted-foreground">
          {t.streakRecord(formatNumber(stats.maxDailyStreak))}
          {' · '}
          {t.dailiesClaimed(formatNumber(stats.totalDailiesClaimed))}
        </p>
      </CardContent>
    </Card>
  )
}
