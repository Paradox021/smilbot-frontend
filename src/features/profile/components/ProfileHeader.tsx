import { UserAvatar, type CurrentUser } from '@/features/auth'
import { hasLuckData, type UserStats } from '@/features/stats'
import { getLuckTier } from '@/shared/config/luckTiers'
import { formatMonthYear } from '@/shared/lib/format'
import { Badge } from '@/shared/ui/badge'
import { profileTexts as t } from '../texts'

function LuckTitle({ luck }: { luck: UserStats['luck'] }) {
  if (!hasLuckData(luck)) return null
  const tier = getLuckTier(luck.tierCode)
  return (
    <Badge variant="secondary" className="h-7 gap-1.5 px-3 text-sm text-foreground">
      {tier && <tier.icon aria-hidden />}
      <span className="sr-only">{t.luckTier}: </span>
      {tier?.name ?? luck.tier}
    </Badge>
  )
}

interface ProfileHeaderProps {
  user: CurrentUser
  /** Cuando llegan las stats se añaden el título de suerte y la antigüedad. */
  stats?: UserStats
}

/** Cabecera de ficha de jugador: identidad de `/auth/me` y título de suerte de las stats. */
export function ProfileHeader({ user, stats }: ProfileHeaderProps) {
  return (
    <header className="flex flex-col items-center gap-4 rounded-lg bg-card px-5 py-7 text-center sm:flex-row sm:gap-6 sm:p-7 sm:text-left">
      <UserAvatar
        username={user.username}
        avatarUrl={user.avatarUrl}
        size="lg"
        className="ring-2 ring-border ring-offset-4 ring-offset-card data-[size=lg]:size-24 md:data-[size=lg]:size-28"
      />
      <div className="flex min-w-0 flex-col items-center gap-2.5 sm:items-start">
        <h1 className="flex flex-wrap items-center justify-center gap-3 text-3xl leading-tight font-extrabold md:text-4xl">
          {user.username}
          {user.isAdmin && <Badge variant="secondary">{t.admin}</Badge>}
        </h1>
        {stats && <LuckTitle luck={stats.luck} />}
        <p className="text-sm text-muted-foreground">
          {stats?.createdAt && (
            <>
              <span>{t.memberSince(formatMonthYear(stats.createdAt))}</span>
              <span aria-hidden> · </span>
            </>
          )}
          {t.discordId}: <span className="font-mono">{user.discordId}</span>
        </p>
      </div>
    </header>
  )
}
