import { Coins } from 'lucide-react'
import { formatNumber } from '@/shared/lib/format'
import { AnimatedNumber } from '@/shared/ui/animated-number'
import { Skeleton } from '@/shared/ui/skeleton'
import { useUserStats } from '../queries'
import { statsTexts as t } from '../texts'

/** Saldo siempre visible en la cabecera. Sale de las stats, nunca de `/auth/me`. */
export function BalancePill({ discordId }: { discordId: string }) {
  const { data: stats, isPending, isError } = useUserStats(discordId)

  if (isPending) return <Skeleton className="h-8 w-20 rounded-full" />
  if (isError) return null

  return (
    <p
      className="flex h-8 items-center gap-1.5 rounded-full bg-secondary px-3 font-heading text-[15px] font-bold tabular-nums"
      title={t.balance}
    >
      <Coins aria-hidden className="size-4 text-primary" />
      <span className="sr-only">{t.balance}: </span>
      <AnimatedNumber value={stats.balance} format={formatNumber} />
    </p>
  )
}
