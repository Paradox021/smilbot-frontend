import { formatNumber } from '@/shared/lib/format'
import { getRarityBreakdown } from '../stats'
import { profileTexts } from '../texts'
import type { LuckStats } from '../types'

export function RarityBreakdown({ breakdown }: { breakdown: LuckStats['breakdown'] }) {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-sm font-medium tracking-[0.2px]">{profileTexts.breakdownTitle}</h3>
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {getRarityBreakdown(breakdown).map(({ rarity, count }) => (
          <li
            key={rarity.key}
            className="flex items-center justify-between gap-2 rounded-sm bg-muted px-3 py-2 text-sm"
          >
            <span className="flex items-center gap-2 text-body">
              <span
                aria-hidden
                className="size-2 rounded-full"
                style={{ backgroundColor: rarity.color }}
              />
              {rarity.name}
            </span>
            <span className="font-medium tabular-nums">{formatNumber(count)}</span>
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
