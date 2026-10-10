import { cn } from 'cn'
import { Button } from '@/shared/ui/button'
import { getDiscordLoginUrl } from '../api'
import { authTexts } from '../texts'
import { DiscordIcon } from './DiscordIcon'

export function LoginButton({
  returnTo,
  className,
}: {
  returnTo?: string | null
  className?: string
}) {
  return (
    <Button asChild size="lg" className={cn('gap-2.5', className)}>
      <a href={getDiscordLoginUrl(returnTo)}>
        <DiscordIcon className="size-5" />
        {authTexts.loginWithDiscord}
      </a>
    </Button>
  )
}
