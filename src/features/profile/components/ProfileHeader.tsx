import { UserAvatar, type CurrentUser } from '@/features/auth'
import { Badge } from '@/shared/ui/badge'
import { profileTexts } from '../texts'

export function ProfileHeader({ user }: { user: CurrentUser }) {
  return (
    <header className="flex items-center gap-4">
      <UserAvatar
        username={user.username}
        avatarUrl={user.avatarUrl}
        size="lg"
        className="size-16 md:size-20"
      />
      <div className="flex min-w-0 flex-col gap-2">
        <h1 className="flex flex-wrap items-center gap-3 text-3xl leading-tight font-extrabold md:text-4xl">
          {user.username}
          {user.isAdmin && <Badge variant="secondary">{profileTexts.admin}</Badge>}
        </h1>
        <p className="text-sm text-muted-foreground">
          {profileTexts.discordId}: <span className="font-mono">{user.discordId}</span>
        </p>
      </div>
    </header>
  )
}
