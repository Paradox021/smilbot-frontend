import { Link } from 'react-router'
import { ChevronDown, LogOut, User } from 'lucide-react'
import { ROUTES } from '@/shared/config/routes'
import { Button } from '@/shared/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'
import { useCurrentUser, useLogoutMutation } from '../queries'
import { authTexts } from '../texts'
import { UserAvatar } from './UserAvatar'

export function UserMenu() {
  const { data: user } = useCurrentUser()
  const logout = useLogoutMutation()

  if (!user) return null

  return (
    <div className="flex items-center gap-3">
      {logout.isError && (
        <p role="alert" className="text-xs text-destructive">
          {authTexts.logoutError}
        </p>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="gap-2 px-1.5 sm:pr-2.5"
            aria-label={authTexts.userMenu}
          >
            <UserAvatar username={user.username} avatarUrl={user.avatarUrl} size="sm" />
            <span className="hidden max-w-32 truncate text-foreground sm:inline">
              {user.username}
            </span>
            <ChevronDown aria-hidden className="hidden sm:block" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuLabel className="truncate">{user.username}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to={ROUTES.profile}>
              <User aria-hidden />
              {authTexts.profile}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => logout.mutate()} disabled={logout.isPending}>
            <LogOut aria-hidden />
            {logout.isPending ? authTexts.loggingOut : authTexts.logout}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
