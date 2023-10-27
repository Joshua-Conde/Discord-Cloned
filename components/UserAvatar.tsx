import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

type UserAvatarProps = {
  src?: string
  className?: string
}
// how differently could we get a user's profile picture rendered with the below code?
export default function UserAvatar({ src, className }: UserAvatarProps) {
  return (
    <Avatar className={cn('h-7 w-7 md:h-10 md:w-10', className)}>
      <AvatarImage src={src} />
    </Avatar>
  )
}
