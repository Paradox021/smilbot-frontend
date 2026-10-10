import { useUserStats } from '../queries'
import { LuckCard } from './LuckCard'
import { PityCard } from './PityCard'
import { ProfileStatsError, ProfileStatsSkeleton } from './ProfileStatsStatus'
import { SummaryCards } from './SummaryCards'

export function ProfileStats({ discordId }: { discordId: string }) {
  const { data: stats, isPending, isError, refetch } = useUserStats(discordId)

  if (isPending) return <ProfileStatsSkeleton />
  if (isError) return <ProfileStatsError onRetry={() => void refetch()} />

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <SummaryCards stats={stats} />
      <PityCard pity={stats.pity} />
      <LuckCard luck={stats.luck} />
    </div>
  )
}
