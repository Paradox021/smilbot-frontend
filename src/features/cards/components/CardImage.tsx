import { useState } from 'react'
import { ImageOff } from 'lucide-react'
import { cardsTexts as t } from '../texts'

/**
 * Imagen de carta a su proporción original, dentro de unos límites de ancho y alto.
 * Reserva única (5:7) si falta `imageUrl` o no carga.
 */
export function CardImage({ name, imageUrl }: { name: string; imageUrl?: string }) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null)

  if (!imageUrl || failedUrl === imageUrl) {
    return (
      <div className="flex aspect-5/7 w-56 flex-col items-center justify-center gap-2 bg-muted text-muted-foreground">
        <ImageOff aria-hidden className="size-6" />
        <span className="text-xs">{t.noImage}</span>
      </div>
    )
  }

  return (
    <img
      src={imageUrl}
      alt={t.imageAlt(name)}
      draggable={false}
      onError={() => setFailedUrl(imageUrl)}
      className="block h-auto max-h-72 w-auto max-w-[min(20rem,calc(100vw-4rem))] min-w-40"
    />
  )
}
