import { Flame } from 'lucide-react'
import type { DailyStatus } from '@/features/daily'
import type { UserStats } from '@/features/stats'
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
            <Flame aria-hidden className="size-7 fill-warning/25 text-warning" />
            {t.streakDays(streak, formatNumber(streak))}
          </p>
        ) : (
          <p className="text-body">{t.streakNone}</p>
        )}
        <StreakPaws
          week={week}
          todayPending={todayPending}
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
