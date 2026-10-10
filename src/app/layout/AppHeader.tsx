import { Link } from 'react-router'
import { UserMenu, useCurrentUser } from '@/features/auth'
import { BalancePill } from '@/features/stats'
import { ROUTES } from '@/shared/config/routes'
import { Mascot } from '@/shared/ui/mascot'
import { appTexts } from '../texts'
import { MainNav } from './MainNav'

export function AppHeader() {
  const { data: user } = useCurrentUser()

  return (
    <header className="border-b bg-background">
      <nav
        aria-label={appTexts.mainNavigation}
        className="mx-auto flex h-16 w-full max-w-4xl items-center gap-6 px-4"
      >
        <Link
          to={ROUTES.home}
          className="flex items-center gap-2 rounded-full pr-1 font-heading text-lg font-extrabold focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none"
        >
          <Mascot className="size-8" sizes="32px" />
          {appTexts.brand}
        </Link>
        {user && (
          <>
            <MainNav />
            <div className="ml-auto flex items-center gap-2">
              <BalancePill discordId={user.discordId} />
              <UserMenu />
            </div>
          </>
        )}
      </nav>
    </header>
  )
}
