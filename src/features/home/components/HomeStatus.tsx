import { ErrorState } from '@/shared/ui/error-state'
import { Skeleton } from '@/shared/ui/skeleton'
import { homeTexts as t } from '../texts'

export function HomeSkeleton() {
  return (
    <div role="status" aria-label={t.loading} className="flex flex-col gap-5">
      <div className="flex items-end gap-3">
        <Skeleton className="size-12 rounded-full sm:size-14" />
        <Skeleton className="h-12 w-full max-w-sm rounded-lg" />
      </div>
      <Skeleton className="h-48 w-full rounded-lg sm:h-40" />
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-56 w-full rounded-lg" />
        <Skeleton className="h-56 w-full rounded-lg" />
      </div>
    </div>
  )
}

export function HomeError({ onRetry }: { onRetry: () => void }) {
  return <ErrorState message={t.loadError} retryLabel={t.retry} onRetry={onRetry} />
}
