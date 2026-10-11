import type { UserStats } from '@/features/stats'
import { KeyStats } from './KeyStats'
import { LuckCard } from './LuckCard'
import { PityCard } from './PityCard'
import { SummaryCards } from './SummaryCards'

/** Cuerpo de la ficha: cifras clave, suerte y, debajo, el resto de stats en tarjetas sencillas. */
export function ProfileStats({ stats }: { stats: UserStats }) {
  return (
    <>
      <KeyStats stats={stats} />
      <div className="grid gap-4 md:grid-cols-2">
        <LuckCard luck={stats.luck} />
        <SummaryCards stats={stats} />
        <div className="md:col-span-2">
          <PityCard pity={stats.pity} />
        </div>
      </div>
    </>
  )
}
