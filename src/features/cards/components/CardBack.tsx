import { PawPrint } from 'lucide-react'
import { cn } from 'cn'
import { rarityStyle } from '../rarityStyle'
import { cardsTexts as t } from '../texts'

interface CardBackProps {
  /** Rareza a mostrar en el marco; sin ella, el marco es neutro. */
  rarityType?: number
  className?: string
}

/** Dorso de carta: sobre sin abrir o carta que aún no se tiene. Proporción 5:7. */
export function CardBack({ rarityType, className }: CardBackProps) {
  return (
    <div
      role="img"
      aria-label={t.cardBack}
      style={rarityType === undefined ? undefined : rarityStyle(rarityType)}
      className={cn(
        'relative flex aspect-5/7 items-center justify-center overflow-hidden rounded-md border bg-card',
        rarityType !== undefined && 'border-(--rarity)',
        className,
      )}
    >
      <div
        aria-hidden
        className="absolute inset-3 rounded-sm border border-foreground/6 bg-[repeating-linear-gradient(135deg,rgb(243_238_231/0.03)_0_6px,transparent_6px_12px)]"
      />
      <div
        aria-hidden
        className="relative flex size-14 items-center justify-center rounded-full border border-foreground/10 bg-secondary"
      >
        <PawPrint className="size-6 text-muted-foreground" />
      </div>
    </div>
  )
}
