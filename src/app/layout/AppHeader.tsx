import { Link } from 'react-router'
import { UserMenu, useCurrentUser } from '@/features/auth'
import { BalancePill } from '@/features/stats'
import { ROUTES } from '@/shared/config/routes'
import { appTexts } from '../texts'
import { MainNav } from './MainNav'

export function AppHeader() {
  const { data: user } = useCurrentUser()

  return (
    <header className="border-b bg-background">
      <nav
        aria-label={appTexts.mainNavigation}
        className="mx-auto flex h-14 w-full max-w-4xl items-center gap-6 px-4"
      >
        <Link
          to={ROUTES.home}
          className="rounded-sm text-base font-semibold tracking-[0.2px] focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
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
