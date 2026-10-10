import { formatDate, formatNumber, formatRelativeTime } from '@/shared/lib/format'
import { profileTexts as t } from '../texts'
import type { UserStats } from '../types'
import { StatsCard } from './StatsCard'

function streakNotes(stats: UserStats, now: Date): string[] {
  const nextDailyAt = new Date(stats.nextDailyAt)
  const notes = [
    nextDailyAt <= now ? t.dailyAvailable : t.nextDaily(formatRelativeTime(nextDailyAt, now)),
  ]
  if (stats.streakExpiresAt) {
    notes.push(t.streakExpires(formatRelativeTime(stats.streakExpiresAt, now)))
  }
  return notes
}

export function SummaryCards({ stats }: { stats: UserStats }) {
  const now = new Date()
  const collectionStats: { label: string; value: string }[] = [
    { label: t.cardsCount, value: formatNumber(stats.cardsCount) },
    { label: t.cardsOpenedCount, value: formatNumber(stats.cardsOpenedCount) },
  ]
  if (stats.createdAt) {
    collectionStats.push({ label: t.memberSince, value: formatDate(stats.createdAt) })
  }

  return (
    <>
      <StatsCard
        title={t.economyTitle}
        stats={[
          { label: t.balance, value: t.coins(formatNumber(stats.balance)) },
          { label: t.totalCoinsEarned, value: t.coins(formatNumber(stats.totalCoinsEarned)) },
          { label: t.totalCoinsSpent, value: t.coins(formatNumber(stats.totalCoinsSpent)) },
          { label: t.marketSalesCount, value: formatNumber(stats.marketSalesCount) },
        ]}
      />
      <StatsCard
        title={t.streakTitle}
        stats={[
          { label: t.dailyStreak, value: t.days(formatNumber(stats.dailyStreak)) },
          { label: t.maxDailyStreak, value: t.days(formatNumber(stats.maxDailyStreak)) },
          { label: t.totalDailiesClaimed, value: formatNumber(stats.totalDailiesClaimed) },
        ]}
        notes={streakNotes(stats, now)}
      />
      <StatsCard title={t.collectionTitle} stats={collectionStats} />
    </>
  )
}
