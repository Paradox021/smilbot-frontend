import { Button } from '@/shared/ui/button'
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
    <div role="alert" className="flex flex-col items-center gap-3 py-12 text-center">
      <p className="text-body">{profileTexts.statsError}</p>
      <Button variant="secondary" onClick={onRetry}>
        {profileTexts.retry}
      </Button>
    </div>
  )
}
