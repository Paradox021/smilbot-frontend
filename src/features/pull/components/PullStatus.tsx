import { Button } from '@/shared/ui/button'
import { Skeleton } from '@/shared/ui/skeleton'
import { pullTexts as t } from '../texts'

export function PullSkeleton() {
  return (
    <div role="status" aria-label={t.loading} className="flex flex-col items-center gap-6 py-10">
      <Skeleton className="aspect-5/7 w-56 rounded-lg sm:w-60" />
      <Skeleton className="h-11 w-48 rounded-md" />
    </div>
  )
}

export function PullError({ onRetry }: { onRetry: () => void }) {
  return (
    <div role="alert" className="flex flex-col items-center gap-3 py-12 text-center">
      <p className="text-body">{t.loadError}</p>
      <Button variant="secondary" onClick={onRetry}>
        {t.retry}
      </Button>
    </div>
  )
}
