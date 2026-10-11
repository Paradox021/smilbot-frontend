import { cn } from 'cn'
import { Flame } from 'lucide-react'
import type { DailyStatus } from '@/features/daily'
import type { UserStats } from '@/features/stats'
import { useBumpKey } from '@/shared/hooks/useBumpKey'
import { formatNumber } from '@/shared/lib/format'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { getStreakWeek } from '../streakWeek'
import { homeTexts as t } from '../texts'
import { StreakPaws } from './StreakPaws'

interface StreakCardProps {
  stats: Pick<UserStats, 'dailyStreak' | 'maxDailyStreak' | 'totalDailiesClaimed'>
  daily: DailyStatus
}

export function StreakCard({ stats, daily }: StreakCardProps) {
  const streak = stats.dailyStreak
  const todayPending = daily.kind === 'available'
  const week = getStreakWeek(streak, !todayPending)
  // Al reclamar: la huella nueva se rellena con un rebote y la llama se aviva.
  const bumpKey = useBumpKey(streak)

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.streakTitle}</CardTitle>
        {week.week > 1 && (
          <CardAction className="text-sm text-muted-foreground tabular-nums">
            {t.streakWeek(formatNumber(week.week))}
          </CardAction>
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {streak > 0 ? (
          <p className="flex items-center gap-2 font-heading text-3xl font-extrabold tabular-nums">
            <Flame
              key={bumpKey}
              aria-hidden
              className={cn(
                'size-7 fill-warning/25 text-warning',
                bumpKey > 0 && 'motion-safe:animate-flare',
              )}
            />
            {t.streakDays(streak, formatNumber(streak))}
          </p>
        ) : (
          <p className="text-body">{t.streakNone}</p>
        )}
        <StreakPaws
          week={week}
          todayPending={todayPending}
          celebrate={bumpKey}
          atRisk={daily.kind === 'available' && daily.streakAtRisk}
        />
        <p className="text-sm text-muted-foreground">
          {t.streakRecord(formatNumber(stats.maxDailyStreak))}
          {' · '}
          {t.dailiesClaimed(formatNumber(stats.totalDailiesClaimed))}
        </p>
      </CardContent>
    </Card>
  )
}
