import { useId } from 'react'
import {
  DailyReward,
  dailyTexts,
  getClaimErrorText,
  useClaimDailyMutation,
  type DailyStatus,
} from '@/features/daily'
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
          onClaim={() => claim.mutate()}
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
