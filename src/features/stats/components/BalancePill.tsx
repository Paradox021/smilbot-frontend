import { useEffect, useRef, useState } from 'react'
import { cn } from 'cn'
import { Coins } from 'lucide-react'
import { onBalanceFx } from '@/shared/lib/balanceFx'
import { formatNumber } from '@/shared/lib/format'
import { prefersReducedMotion } from '@/shared/lib/motion'
import { AnimatedNumber } from '@/shared/ui/animated-number'
import { Skeleton } from '@/shared/ui/skeleton'
import { flyCoins } from '../coinFlight'
import { useUserStats } from '../queries'
import { statsTexts as t } from '../texts'

interface FloatingDelta {
  id: number
  text: string
  gain: boolean
}

const FLOAT_MS = 1200

/** Recibe los efectos del saldo: monedas que llegan (con salto de la moneda) y cifras que flotan. */
function useBalanceFx() {
  const pillRef = useRef<HTMLParagraphElement>(null)
  const [bumpKey, setBumpKey] = useState(0)
  const [deltas, setDeltas] = useState<FloatingDelta[]>([])

  useEffect(() => {
    let nextId = 0
    const timers = new Set<number>()
    const float = (text: string, gain: boolean) => {
      const id = nextId++
      setDeltas((current) => [...current, { id, text, gain }])
      const timer = window.setTimeout(() => {
        timers.delete(timer)
        setDeltas((current) => current.filter((delta) => delta.id !== id))
      }, FLOAT_MS)
      timers.add(timer)
    }
    const bump = () => setBumpKey((key) => key + 1)

    const stop = onBalanceFx((fx) => {
      if (fx.kind === 'spend') {
        float(t.spent(formatNumber(fx.amount)), false)
        return
      }
      const to = pillRef.current?.getBoundingClientRect()
      const arrive = () => {
        bump()
        float(t.earned(formatNumber(fx.amount)), true)
      }
      if (fx.from && to && !prefersReducedMotion()) void flyCoins(fx.from, to).then(arrive)
      else arrive()
    })
    return () => {
      stop()
      timers.forEach((timer) => window.clearTimeout(timer))
    }
  }, [])

  return { pillRef, bumpKey, deltas }
}

/** Saldo siempre visible en la cabecera. Sale de las stats, nunca de `/auth/me`. */
export function BalancePill({ discordId }: { discordId: string }) {
  const { data: stats, isPending, isError } = useUserStats(discordId)
  const { pillRef, bumpKey, deltas } = useBalanceFx()

  if (isPending) return <Skeleton className="h-8 w-20 rounded-full" />
  if (isError) return null

  return (
    <div className="relative">
      <p
        ref={pillRef}
        className="flex h-8 items-center gap-1.5 rounded-full bg-secondary px-3 font-heading text-[15px] font-bold tabular-nums"
        title={t.balance}
      >
        <Coins
          key={bumpKey}
          aria-hidden
          className={cn('size-4 text-primary', bumpKey > 0 && 'motion-safe:animate-bump')}
        />
        <span className="sr-only">{t.balance}: </span>
        <AnimatedNumber value={stats.balance} format={formatNumber} />
      </p>
      {deltas.map((delta) => (
        <span
          key={delta.id}
          aria-hidden
          className={cn(
            'pointer-events-none absolute top-full right-3 mt-1 font-heading text-sm font-extrabold tabular-nums motion-safe:animate-float-up motion-reduce:animate-fade-in',
            delta.gain ? 'text-success' : 'text-muted-foreground',
          )}
        >
          {delta.text}
        </span>
      ))}
    </div>
  )
}
