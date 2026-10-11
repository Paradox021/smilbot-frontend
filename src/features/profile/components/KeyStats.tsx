import { Flame, Layers, Package, type LucideIcon } from 'lucide-react'
import type { UserStats } from '@/features/stats'
import { formatNumber } from '@/shared/lib/format'
import { profileTexts as t } from '../texts'

interface KeyStat {
  label: string
  value: string
  icon: LucideIcon
}

/** Cifras clave de la ficha: grandes, con icono, en una fila. */
export function KeyStats({ stats }: { stats: UserStats }) {
  const items: KeyStat[] = [
    { label: t.cardsCount, value: formatNumber(stats.cardsCount), icon: Layers },
    { label: t.cardsOpenedCount, value: formatNumber(stats.cardsOpenedCount), icon: Package },
    { label: t.maxDailyStreak, value: t.days(formatNumber(stats.maxDailyStreak)), icon: Flame },
  ]

  return (
    <dl className="grid grid-cols-3 gap-3">
      {items.map(({ label, value, icon: Icon }) => (
        <div key={label} className="flex flex-col gap-1 rounded-lg bg-card p-4 sm:p-5">
          <dt className="order-last text-xs text-muted-foreground sm:text-sm">{label}</dt>
          <dd className="flex flex-col gap-2 font-heading text-xl font-extrabold whitespace-nowrap tabular-nums sm:text-3xl">
            <Icon aria-hidden className="size-5 text-muted-foreground" />
            {value}
          </dd>
        </div>
      ))}
    </dl>
  )
}
