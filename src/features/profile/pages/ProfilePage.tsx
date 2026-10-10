import { useCurrentUser } from '@/features/auth'
import { ProfileHeader } from '../components/ProfileHeader'
import { ProfileStats } from '../components/ProfileStats'

export function ProfilePage() {
  const { data: user } = useCurrentUser()
  if (!user) return null

  return (
    <section className="flex flex-col gap-6">
      <ProfileHeader user={user} />
      <ProfileStats discordId={user.discordId} />
    </section>
  )
}
