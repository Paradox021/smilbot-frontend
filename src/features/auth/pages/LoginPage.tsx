import { Navigate } from 'react-router'
import { ROUTES } from '@/shared/config/routes'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
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
    <Card className="mx-auto w-full max-w-md text-center">
      <CardHeader>
        <CardTitle className="text-xl">{authTexts.welcomeTitle}</CardTitle>
        <CardDescription>{authTexts.welcomeDescription}</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <LoginButton />
      </CardContent>
    </Card>
  )
}
