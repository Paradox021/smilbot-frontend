import { Button } from '@/shared/ui/button'
import { authTexts } from '../texts'

export function SessionLoading() {
  return (
    <p role="status" className="py-12 text-center text-muted-foreground">
      {authTexts.loadingSession}
    </p>
  )
}

export function SessionError({ onRetry }: { onRetry: () => void }) {
  return (
    <div role="alert" className="flex flex-col items-center gap-3 py-12 text-center">
      <p>{authTexts.sessionError}</p>
      <Button variant="outline" onClick={onRetry}>
        {authTexts.retry}
      </Button>
    </div>
  )
}
