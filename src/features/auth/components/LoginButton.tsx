import { Button } from '@/shared/ui/button'
import { getDiscordLoginUrl } from '../api'
import { authTexts } from '../texts'

export function LoginButton({ returnTo }: { returnTo?: string | null }) {
  return (
    <Button asChild size="lg">
      <a href={getDiscordLoginUrl(returnTo)}>{authTexts.loginWithDiscord}</a>
    </Button>
  )
}
