import type { ReactNode } from 'react'
import { cn } from 'cn'
import { getRarityName, rarityStyle } from '../rarityStyle'
import type { Card } from '../types'
import { CardImage } from './CardImage'

interface CardFrontProps {
  card: Pick<Card, 'name' | 'type' | 'imageUrl'>
  className?: string
  /** Capa opcional sobre la imagen (p. ej. brillo holográfico). */
  overlay?: ReactNode
}

/**
 * Cara de una carta: la imagen entera a su proporción, con el marco del color de su rareza
 * y el nombre debajo. El ancho lo marca la imagen; el pie se ajusta a él.
 */
export function CardFront({ card, className, overlay }: CardFrontProps) {
  return (
    <div
      style={rarityStyle(card.type)}
      className={cn(
        'inline-grid overflow-hidden rounded-md border border-(--rarity) bg-card',
        className,
      )}
    >
      <div className="relative overflow-hidden">
        <CardImage name={card.name} imageUrl={card.imageUrl} />
        {overlay}
      </div>
      {/* `w-0 min-w-full`: el pie no ensancha la carta, ocupa lo que mida la imagen. */}
      <div className="flex w-0 min-w-full flex-col gap-0.5 border-t border-(--rarity)/40 px-3 py-2 text-left">
        <span className="truncate text-sm font-semibold">{card.name}</span>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span aria-hidden className="size-2 rounded-full bg-(--rarity)" />
          {getRarityName(card.type)}
        </span>
      </div>
    </div>
  )
}
