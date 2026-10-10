import { cn } from 'cn'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { getInitials } from '../initials'

interface UserAvatarProps {
  username: string
  avatarUrl?: string | null
  size?: 'default' | 'sm' | 'lg'
  className?: string
}

/** Avatar de Discord del usuario con iniciales como respaldo (sin URL o si la imagen falla). */
export function UserAvatar({ username, avatarUrl, size = 'default', className }: UserAvatarProps) {
  return (
    <Avatar size={size} className={className}>
      {avatarUrl && <AvatarImage src={avatarUrl} alt="" />}
      <AvatarFallback aria-hidden className={cn(size === 'lg' && 'text-base')}>
        {getInitials(username)}
      </AvatarFallback>
    </Avatar>
  )
}
