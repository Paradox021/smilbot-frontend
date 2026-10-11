import { Link } from 'react-router'
import { ArrowRight } from 'lucide-react'
import { useCurrentUser } from '@/features/auth'
import { getDailyStatus } from '@/features/daily'
import { useUserStats } from '@/features/stats'
import { ROUTES } from '@/shared/config/routes'
import { useNow } from '@/shared/hooks/useNow'
import { Button } from '@/shared/ui/button'
import { GuaranteeCard } from '../components/GuaranteeCard'
import { HomeGuide } from '../components/HomeGuide'
import { HomeError, HomeSkeleton } from '../components/HomeStatus'
import { StreakCard } from '../components/StreakCard'
import { TodayCard } from '../components/TodayCard'
import { homeTexts as t } from '../texts'

function HomeContent({ discordId }: { discordId: string }) {
  const { data: stats, isPending, isError, refetch } = useUserStats(discordId)
  const now = useNow()

  if (isPending) return <HomeSkeleton />
  if (isError) return <HomeError onRetry={() => void refetch()} />

  const daily = getDailyStatus(stats, now)

  return (
    <>
      <HomeGuide stats={stats} daily={daily} now={now} />
      <TodayCard discordId={discordId} daily={daily} now={now} />
      <div className="grid gap-4 md:grid-cols-2">
        <StreakCard stats={stats} daily={daily} />
        <GuaranteeCard pity={stats.pity} showPackLink={daily.kind === 'available'} />
      </div>
    </>
  )
}

/** Inicio como lobby: Smilbot, la acción del día y el progreso. */
export function HomePage() {
  const { data: user } = useCurrentUser()
  if (!user) return null

  return (
    <section className="flex flex-col gap-5">
      <h1 className="text-3xl font-extrabold md:text-4xl">{t.greeting(user.username)}</h1>
      <HomeContent discordId={user.discordId} />
      <Button asChild variant="ghost" className="self-start">
        <Link to={ROUTES.profile}>
          {t.allStats}
          <ArrowRight aria-hidden />
        </Link>
      </Button>
    </section>
  )
}
