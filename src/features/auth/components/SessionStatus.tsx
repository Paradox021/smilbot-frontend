import { ErrorState } from '@/shared/ui/error-state'
import { Mascot } from '@/shared/ui/mascot'
import { authTexts } from '../texts'

/** Comprobando la sesión (carga de página completa). Aparece con retraso para no parpadear. */
export function SessionLoading() {
  return (
    <div
      role="status"
      className="flex flex-col items-center gap-5 py-16 text-center motion-safe:animate-[fade-in_400ms_300ms_both]"
    >
      <Mascot halo className="size-24" sizes="96px" />
      <p className="text-muted-foreground">{authTexts.loadingSession}</p>
    </div>
  )
}

export function SessionError({ onRetry }: { onRetry: () => void }) {
  return (
    <ErrorState message={authTexts.sessionError} retryLabel={authTexts.retry} onRetry={onRetry} />
  )
}
