import { formatNumber } from '@/shared/lib/format'
import { getRarityBreakdown } from '../stats'
import { profileTexts } from '../texts'
import type { LuckStats } from '../types'

export function RarityBreakdown({ breakdown }: { breakdown: LuckStats['breakdown'] }) {
  return (
    <section className="flex flex-col gap-2">
      <h3 className="text-sm font-medium">{profileTexts.breakdownTitle}</h3>
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {getRarityBreakdown(breakdown).map(({ rarity, count }) => (
          <li
            key={rarity.key}
            className="flex items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm"
          >
            <span className="flex items-center gap-2">
              <span
                aria-hidden
                className="size-2.5 rounded-full"
                style={{ backgroundColor: rarity.color }}
              />
              {rarity.name}
            </span>
            <span className="font-semibold tabular-nums">{formatNumber(count)}</span>
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
