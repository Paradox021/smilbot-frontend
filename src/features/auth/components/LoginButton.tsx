import { Button } from '@/shared/ui/button'
import { discordLoginUrl } from '../api'
import { authTexts } from '../texts'

export function LoginButton() {
  return (
    <Button asChild size="lg">
      <a href={discordLoginUrl}>{authTexts.loginWithDiscord}</a>
    </Button>
  )
}
