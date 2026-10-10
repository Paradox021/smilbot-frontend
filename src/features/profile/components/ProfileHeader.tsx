import type { CurrentUser } from '@/features/auth'
import { Badge } from '@/shared/ui/badge'
import { profileTexts } from '../texts'

export function ProfileHeader({ user }: { user: CurrentUser }) {
  return (
    <header className="flex flex-col gap-1">
      <h1 className="flex flex-wrap items-center gap-2 text-2xl font-bold">
        {user.username}
        {user.isAdmin && <Badge variant="secondary">{profileTexts.admin}</Badge>}
      </h1>
      <p className="text-sm text-muted-foreground">
        {profileTexts.discordId}: <span className="font-mono">{user.discordId}</span>
      </p>
    </header>
  )
}
