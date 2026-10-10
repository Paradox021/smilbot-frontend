import type { CurrentUser } from '@/features/auth'
import { formatDate, formatNumber } from '@/shared/lib/format'
import { Badge } from '@/shared/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { profileTexts } from '../texts'
import { ProfileStat } from './ProfileStat'

export function ProfileSummary({ user }: { user: CurrentUser }) {
  const stats = [
    { label: profileTexts.balance, value: profileTexts.coins(formatNumber(user.balance)) },
    { label: profileTexts.dailyStreak, value: profileTexts.days(formatNumber(user.dailyStreak)) },
    {
      label: profileTexts.maxDailyStreak,
      value: profileTexts.days(formatNumber(user.maxDailyStreak)),
    },
    { label: profileTexts.totalDailiesClaimed, value: formatNumber(user.totalDailiesClaimed) },
    { label: profileTexts.cardsOpenedCount, value: formatNumber(user.cardsOpenedCount) },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center gap-2 text-xl">
          {user.username}
          {user.isAdmin && <Badge variant="secondary">{profileTexts.admin}</Badge>}
        </CardTitle>
        <CardDescription>
          {profileTexts.discordId}: <span className="font-mono">{user.discordId}</span> ·{' '}
          {profileTexts.memberSince} {formatDate(user.createdAt)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {stats.map((stat) => (
            <ProfileStat key={stat.label} {...stat} />
          ))}
        </dl>
      </CardContent>
    </Card>
  )
}
