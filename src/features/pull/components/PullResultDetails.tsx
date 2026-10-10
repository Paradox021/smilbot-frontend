import { motion } from 'motion/react'
import { getRarityColor } from '@/features/cards'
import { getRarity } from '@/shared/config/rarities'
import { formatPercent } from '@/shared/lib/format'
import { Badge } from '@/shared/ui/badge'
import { pullTexts as t } from '../texts'
import type { PullOutcome } from '../types'

/** Nombre, rareza y probabilidad de la carta obtenida, con sus insignias. */
export function PullResultDetails({ outcome }: { outcome: PullOutcome }) {
  const { result, isNew } = outcome
  const rarity = getRarity(result.type)

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="flex flex-col items-center gap-2"
    >
      {(isNew || result.isPity) && (
        <div className="flex flex-wrap justify-center gap-2">
          {isNew && <Badge>{t.newBadge}</Badge>}
          {result.isPity && <Badge variant="secondary">{t.pityBadge}</Badge>}
        </div>
      )}
      <h2 className="text-xl font-medium tracking-[0.2px]">{result.name}</h2>
      {rarity && (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <span
            aria-hidden
            className="size-2 rounded-full"
            style={{ backgroundColor: getRarityColor(result.type) }}
          />
          {t.rarityLine(rarity.name, formatPercent(rarity.probability * 100))}
        </p>
      )}
      {result.description && (
        <p className="line-clamp-2 max-w-sm text-sm text-body">{result.description}</p>
      )}
    </motion.div>
  )
}
