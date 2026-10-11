import { useCurrentUser, type CurrentUser } from '@/features/auth'
import { useUserStats } from '@/features/stats'
import { ProfileHeader } from '../components/ProfileHeader'
import { ProfileStats } from '../components/ProfileStats'
import { ProfileStatsError, ProfileStatsSkeleton } from '../components/ProfileStatsStatus'

function PlayerCard({ user }: { user: CurrentUser }) {
  const { data: stats, isPending, isError, refetch } = useUserStats(user.discordId)

  return (
    <>
      <ProfileHeader user={user} stats={stats} />
      {isPending ? (
        <ProfileStatsSkeleton />
      ) : isError ? (
        <ProfileStatsError onRetry={() => void refetch()} />
      ) : (
        <ProfileStats stats={stats} />
      )}
    </>
  )
}

/** Perfil como ficha de jugador. */
export function ProfilePage() {
  const { data: user } = useCurrentUser()
  if (!user) return null

  return (
    <section className="flex flex-col gap-4">
      <PlayerCard user={user} />
    </section>
  )
}
