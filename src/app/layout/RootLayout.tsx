import { Outlet } from 'react-router'
import { LoginResultNotice } from '@/features/auth'
import { AppHeader } from './AppHeader'

export function RootLayout() {
  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <AppHeader />
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 py-8 md:py-12">
        <LoginResultNotice />
        <Outlet />
      </main>
    </div>
  )
}
