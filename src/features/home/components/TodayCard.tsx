import { useId, useRef } from 'react'
import {
  DailyReward,
  dailyTexts,
  getClaimErrorText,
  useClaimDailyMutation,
  type DailyStatus,
} from '@/features/daily'
import { DAILY_REWARD } from '@/shared/config/economy'
import { emitBalanceFx } from '@/shared/lib/balanceFx'
import { homeTexts as t } from '../texts'
import { OpenPackPanel } from './OpenPackPanel'

interface TodayCardProps {
  discordId: string
  daily: DailyStatus
  now: Date
}

/** Acción del día y única tarjeta con botón naranja: el daily si está disponible; si no, un sobre. */
export function TodayCard({ discordId, daily, now }: TodayCardProps) {
  const titleId = useId()
  const claim = useClaimDailyMutation(discordId)
  const claimButtonRef = useRef<HTMLButtonElement>(null)

  const claimDaily = () => {
    // Se mide al pulsar: cuando llega la respuesta, el botón ya no está.
    const from = claimButtonRef.current?.getBoundingClientRect()
    claim.mutate(undefined, {
      onSuccess: () => emitBalanceFx({ kind: 'gain', amount: DAILY_REWARD, from }),
    })
  }

  return (
    <section
      aria-labelledby={titleId}
      className="flex flex-col gap-4 rounded-lg bg-secondary p-5 sm:p-6"
    >
      <h2 id={titleId} className="text-xl font-bold">
        {daily.kind === 'available' ? dailyTexts.title : t.packTitle}
      </h2>
      {daily.kind === 'available' ? (
        <DailyReward
          status={daily}
          now={now}
          pending={claim.isPending}
          onClaim={claimDaily}
          buttonRef={claimButtonRef}
        />
      ) : (
        <OpenPackPanel availableAt={daily.availableAt} now={now} claimResult={claim.data} />
      )}
      {claim.isError && (
        <p role="alert" className="text-sm text-destructive">
          {getClaimErrorText(claim.error)}
        </p>
      )}
    </section>
  )
}
