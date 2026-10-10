import { Button } from '@/shared/ui/button'
import { useCurrentUser, useLogoutMutation } from '../queries'
import { authTexts } from '../texts'

export function UserMenu() {
  const { data: user } = useCurrentUser()
  const logout = useLogoutMutation()

  if (!user) return null

  return (
    <div className="flex items-center gap-3">
      <span className="hidden truncate text-sm text-muted-foreground sm:inline">
        {user.username}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => logout.mutate()}
        disabled={logout.isPending}
      >
        {logout.isPending ? authTexts.loggingOut : authTexts.logout}
      </Button>
      {logout.isError && (
        <p role="alert" className="text-xs text-destructive">
          {authTexts.logoutError}
        </p>
      )}
    </div>
  )
}
