import { MotionConfig } from 'motion/react'
import { useCurrentUser } from '@/features/auth'
import { useInventory } from '@/features/inventory'
import { useUserStats } from '@/features/stats'
import { PullExperience } from '../components/PullExperience'
import { PullError, PullSkeleton } from '../components/PullStatus'

function PullContent({ discordId }: { discordId: string }) {
  const { data: stats, isPending, isError, refetch } = useUserStats(discordId)
  // Precarga el inventario para saber si la carta que sale es nueva.
  useInventory(discordId)

  if (isPending) return <PullSkeleton />
  if (isError) return <PullError onRetry={() => void refetch()} />
  return <PullExperience stats={stats} />
}

export function PullPage() {
  const { data: user } = useCurrentUser()
  if (!user) return null

  return (
    <MotionConfig reducedMotion="user">
      <PullContent discordId={user.discordId} />
    </MotionConfig>
  )
}
