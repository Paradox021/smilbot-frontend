import { ErrorState } from '@/shared/ui/error-state'
import { Skeleton } from '@/shared/ui/skeleton'
import { profileTexts } from '../texts'

export function ProfileStatsSkeleton() {
  return (
    <div role="status" aria-label={profileTexts.loadingStats} className="grid gap-4 md:grid-cols-2">
      {Array.from({ length: 4 }, (_, index) => (
        <Skeleton key={index} className="h-48 w-full rounded-lg" />
      ))}
    </div>
  )
}

export function ProfileStatsError({ onRetry }: { onRetry: () => void }) {
  return (
    <ErrorState
      message={profileTexts.statsError}
      retryLabel={profileTexts.retry}
      onRetry={onRetry}
    />
  )
}
