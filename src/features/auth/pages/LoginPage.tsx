import { Navigate } from 'react-router'
import { ROUTES } from '@/shared/config/routes'
import { LoginButton } from '../components/LoginButton'
import { SessionError, SessionLoading } from '../components/SessionStatus'
import { useCurrentUser } from '../queries'
import { authTexts } from '../texts'

export function LoginPage() {
  const { data: user, isPending, isError, refetch } = useCurrentUser()

  if (isPending) return <SessionLoading />
  if (isError) return <SessionError onRetry={() => void refetch()} />
  if (user) return <Navigate to={ROUTES.profile} replace />

  return (
    <section className="flex flex-col items-start gap-6 py-8 md:py-16">
      <h1 className="text-4xl leading-[1.1] font-semibold md:text-6xl">{authTexts.welcomeTitle}</h1>
      <p className="max-w-[48ch] text-lg leading-relaxed text-body">
        {authTexts.welcomeDescription}
      </p>
      <LoginButton />
    </section>
  )
}
