import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { ProfileStat } from './ProfileStat'

interface StatsCardProps {
  title: string
  stats: { label: string; value: string }[]
  /** Líneas de estado bajo las cifras (p. ej. disponibilidad del daily). */
  notes?: string[]
}

export function StatsCard({ title, stats, notes = [] }: StatsCardProps) {
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
        {notes.length > 0 && (
          <ul className="mt-5 flex flex-col gap-1 text-sm text-muted-foreground">
            {notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
