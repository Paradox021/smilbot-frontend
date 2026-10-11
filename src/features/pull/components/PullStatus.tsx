import { ErrorState } from '@/shared/ui/error-state'
import { Skeleton } from '@/shared/ui/skeleton'
import { pullTexts as t } from '../texts'

export function PullSkeleton() {
  return (
    <div role="status" aria-label={t.loading} className="flex flex-col items-center gap-6 py-10">
      <Skeleton className="aspect-5/7 w-56 rounded-md sm:w-60" />
      <Skeleton className="h-12 w-full max-w-xs rounded-full" />
    </div>
  )
}

export function PullError({ onRetry }: { onRetry: () => void }) {
  return <ErrorState message={t.loadError} retryLabel={t.retry} onRetry={onRetry} />
}
