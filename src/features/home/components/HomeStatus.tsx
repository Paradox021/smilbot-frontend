import { Button } from '@/shared/ui/button'
import { Skeleton } from '@/shared/ui/skeleton'
import { homeTexts as t } from '../texts'

export function HomeSkeleton() {
  return (
    <div role="status" aria-label={t.loading} className="flex flex-col gap-4">
      <Skeleton className="h-36 w-full rounded-lg md:h-28" />
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-44 w-full rounded-lg" />
        <Skeleton className="h-44 w-full rounded-lg" />
      </div>
    </div>
  )
}

export function HomeError({ onRetry }: { onRetry: () => void }) {
  return (
    <div role="alert" className="flex flex-col items-center gap-3 py-12 text-center">
      <p className="text-body">{t.loadError}</p>
      <Button variant="secondary" onClick={onRetry}>
        {t.retry}
      </Button>
    </div>
  )
}
