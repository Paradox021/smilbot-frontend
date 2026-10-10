import { Link } from 'react-router'
import { useCurrentUser } from '@/features/auth'
import { DailyCard } from '@/features/daily'
import { useUserStats } from '@/features/stats'
import { ROUTES } from '@/shared/config/routes'
import { Button } from '@/shared/ui/button'
import { GuaranteeCard } from '../components/GuaranteeCard'
import { HomeError, HomeSkeleton } from '../components/HomeStatus'
import { StreakCard } from '../components/StreakCard'
import { homeTexts as t } from '../texts'

function HomeContent({ discordId }: { discordId: string }) {
  const { data: stats, isPending, isError, refetch } = useUserStats(discordId)

  if (isPending) return <HomeSkeleton />
  if (isError) return <HomeError onRetry={() => void refetch()} />

  return (
    <div className="flex flex-col gap-4">
      <DailyCard stats={stats} />
      <div className="grid gap-4 md:grid-cols-2">
        <StreakCard stats={stats} />
        <GuaranteeCard pity={stats.pity} />
      </div>
    </div>
  )
}

export function HomePage() {
  const { data: user } = useCurrentUser()
  if (!user) return null

  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-2xl font-medium tracking-[0.2px] md:text-3xl">
        {t.greeting(user.username)}
      </h1>
      <HomeContent discordId={user.discordId} />
      <Button asChild variant="secondary" className="self-start">
        <Link to={ROUTES.profile}>{t.allStats}</Link>
      </Button>
    </section>
  )
}
