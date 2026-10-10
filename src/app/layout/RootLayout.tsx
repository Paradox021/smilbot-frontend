import { cn } from 'cn'
import { Outlet } from 'react-router'
import { LoginResultNotice, useCurrentUser } from '@/features/auth'
import { AppHeader } from './AppHeader'
import { BottomNav } from './BottomNav'

export function RootLayout() {
  const { data: user } = useCurrentUser()

  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <AppHeader />
      <main
        className={cn(
          'mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 py-8 md:py-12',
          user && 'pb-28 md:pb-12',
        )}
      >
        <LoginResultNotice />
        <Outlet />
      </main>
      {user && <BottomNav />}
    </div>
  )
}
