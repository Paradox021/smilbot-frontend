import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { ProfileStat } from './ProfileStat'

interface StatsCardProps {
  title: string
  stats: { label: string; value: string }[]
}

export function StatsCard({ title, stats }: StatsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-5">
          {stats.map((stat) => (
            <ProfileStat key={stat.label} {...stat} />
          ))}
        </dl>
      </CardContent>
    </Card>
  )
}
