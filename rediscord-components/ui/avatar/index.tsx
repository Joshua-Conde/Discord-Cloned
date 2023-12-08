import Image from 'next/image'
import { BsDiscord } from 'react-icons/bs'
import clsx from '../../../rediscord-lib/clsx'
import StatusBadge from '../badge/status-badge'
import { UserStatuses } from '../../../rediscord-lib/entities/user'

interface AvatarProps {
  status?: UserStatuses
  size?: 'sm' | 'md' | 'lg'
  src?: string | null
  alt: string
  className?: string
}

export default function Avatar({
  status,
  size = 'md',
  src,
  alt,
  className,
}: AvatarProps) {
  return (
    <div
      className={clsx(
        'relative flex h-8 w-8 items-center justify-center rounded-full text-white',
        size === 'sm' && 'h-6 w-6',
        size === 'md' && 'h-8 w-8',
        size === 'lg' && 'h-12 w-12',
        src ? 'bg-white/5' : 'bg-orange-400',
        className,
      )}
    >
      {src ? (
        <Image
          className={'rounded-full'}
          unoptimized
          priority
          src={src}
          width={32}
          height={32}
          alt={alt}
        />
      ) : (
        <BsDiscord fontSize={18} />
      )}
      {status && (
        <StatusBadge className="absolute -bottom-1 -right-1" status={status} />
      )}
    </div>
  )
}
