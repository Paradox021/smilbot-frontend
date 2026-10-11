import { cn } from 'cn'
import { PackArt } from '@/features/cards'

/** Montón de tres sobres, decorativo. */
export function PackStack({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn('relative aspect-square', className)}>
      <PackArt className="absolute top-[8%] left-0 w-[56%] -rotate-14 brightness-75" />
      <PackArt className="absolute top-[8%] right-0 w-[56%] rotate-14 brightness-75" />
      <PackArt className="absolute top-0 left-[21%] w-[58%] drop-shadow-[0_8px_16px_rgb(0_0_0/0.35)]" />
    </div>
  )
}
