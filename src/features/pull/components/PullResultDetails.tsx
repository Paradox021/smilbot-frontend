import { motion } from 'motion/react'
import { getRarityColor } from '@/features/cards'
import { getRarity } from '@/shared/config/rarities'
import { formatNumber, formatPercent } from '@/shared/lib/format'
import { Badge } from '@/shared/ui/badge'
import { SmilbotSays } from '@/shared/ui/smilbot-says'
import { getSmilbotReaction } from '../smilbotReaction'
import { pullTexts as t } from '../texts'
import type { PullOutcome } from '../types'
import { NewBadge } from './NewBadge'

function ResultBadges({ outcome }: { outcome: PullOutcome }) {
  const { result, isNew, copies } = outcome
  const duplicate = isNew === false && copies !== null
  if (!isNew && !duplicate && !result.isPity) return null

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {isNew && <NewBadge />}
      {duplicate && (
        <Badge variant="secondary" className="tabular-nums">
          <span aria-hidden>{t.copiesBadge(formatNumber(copies))}</span>
          <span className="sr-only">{t.copiesLabel(formatNumber(copies))}</span>
        </Badge>
      )}
      {result.isPity && <Badge variant="secondary">{t.pityBadge}</Badge>}
    </div>
  )
}

/** Nombre, rareza y probabilidad de la carta obtenida, con sus insignias y la reacción de Smilbot. */
export function PullResultDetails({ outcome }: { outcome: PullOutcome }) {
  const { result } = outcome
  const rarity = getRarity(result.type)
  const reaction = getSmilbotReaction(outcome)

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="flex flex-col items-center gap-2"
    >
      <ResultBadges outcome={outcome} />
      <h2 className="text-2xl font-extrabold">{result.name}</h2>
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
      {/* La reacción ya va en el anuncio del resultado: aquí es solo visual. */}
      {reaction && (
        <div aria-hidden className="mt-3">
          <SmilbotSays messageKey={reaction} className="text-left">
            {t.smilbot[reaction]}
          </SmilbotSays>
        </div>
      )}
    </motion.div>
  )
}
