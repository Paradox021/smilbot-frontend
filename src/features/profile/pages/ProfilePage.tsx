import { useCurrentUser } from '@/features/auth'
import { profileTexts } from '../texts'
import { ProfileSummary } from '../components/ProfileSummary'

/** Página mínima: de momento solo pinta `GET /auth/me` para validar el flujo de sesión. */
export function ProfilePage() {
  const { data: user } = useCurrentUser()
  if (!user) return null

  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">{profileTexts.title}</h1>
      <ProfileSummary user={user} />
    </section>
  )
}
