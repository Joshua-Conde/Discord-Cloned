import clsx from '../../../rediscord-lib/clsx'
import AvatarSkeleton from '../../ui/avatar/avatar-skeleton'
import TextSkeleton from '../../ui/text/text-skeleton'
import Header from '../header'

interface PageHeaderSkeletonProps {
  gap?: string
  boxSkeletonType?: 'icon' | 'avatar'
}
export default function PageHeaderSkeleton({
  gap = '2',
  boxSkeletonType = 'icon',
}: PageHeaderSkeletonProps) {
  return (
    <Header className="flex-none justify-between">
      <div className={clsx('flex animate-pulse items-center', `gap-${gap}`)}>
        {boxSkeletonType === 'icon' ? (
          <div className="h-5 w-5 rounded-full bg-gray-800" />
        ) : (
          <AvatarSkeleton />
        )}
        <TextSkeleton fontSize="sm" length={7} />
      </div>
    </Header>
  )
}
