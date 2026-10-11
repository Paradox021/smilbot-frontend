import { RotateCw } from 'lucide-react'
import { Button } from './button'
import { Mascot } from './mascot'

interface ErrorStateProps {
  message: string
  retryLabel: string
  onRetry: () => void
}

/** Error de pantalla: Smilbot da la cara, con el mensaje y un reintento. */
export function ErrorState({ message, retryLabel, onRetry }: ErrorStateProps) {
  return (
    <div role="alert" className="flex flex-col items-center gap-3 py-10 text-center">
      <Mascot halo className="mb-4 size-28" sizes="112px" />
      <p className="max-w-sm text-pretty text-body">{message}</p>
      <Button variant="secondary" onClick={onRetry}>
        <RotateCw aria-hidden />
        {retryLabel}
      </Button>
    </div>
  )
}
