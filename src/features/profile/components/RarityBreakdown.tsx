import { getRarityBreakdown, type LuckStats } from '@/features/stats'
import { formatNumber } from '@/shared/lib/format'
import { profileTexts } from '../texts'

/** Barra apilada con los colores de rareza y una leyenda: la rareza nunca solo con color. */
export function RarityBreakdown({ breakdown }: { breakdown: LuckStats['breakdown'] }) {
  const rows = getRarityBreakdown(breakdown)

  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-sm font-bold">{profileTexts.breakdownTitle}</h3>
      <div aria-hidden className="flex h-3 gap-0.5 overflow-hidden rounded-full bg-muted">
        {rows
          .filter(({ count }) => count > 0)
          .map(({ rarity, count }) => (
            <span
              key={rarity.key}
              className="h-full"
              style={{ flexGrow: count, backgroundColor: rarity.color }}
            />
          ))}
      </div>
      <ul className="flex flex-wrap gap-x-5 gap-y-2">
        {rows.map(({ rarity, count }) => (
          <li key={rarity.key} className="flex items-center gap-2 text-sm">
            <span
              aria-hidden
              className="size-2.5 rounded-full"
              style={{ backgroundColor: rarity.color }}
            />
            <span className="text-body">{rarity.name}</span>
            <span className="font-heading font-bold tabular-nums">{formatNumber(count)}</span>
          </li>
        ))}
      </ul>
      {breakdown.pityMythics > 0 && (
        <p className="text-xs text-muted-foreground">
          {profileTexts.pityMythics(formatNumber(breakdown.pityMythics))}
        </p>
      )}
    </section>
  )
}
