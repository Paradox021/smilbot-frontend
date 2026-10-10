import { Link } from 'react-router'
import { UserMenu } from '@/features/auth'
import { ROUTES } from '@/shared/config/routes'
import { appTexts } from '../texts'

export function AppHeader() {
  return (
    <header className="border-b bg-background">
      <nav
        aria-label={appTexts.mainNavigation}
        className="mx-auto flex h-14 w-full max-w-4xl items-center justify-between gap-4 px-4"
      >
        <Link
          to={ROUTES.home}
          className="rounded-sm text-base font-semibold tracking-[0.2px] focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          {appTexts.brand}
        </Link>
        <UserMenu />
      </nav>
    </header>
  )
}
