import ActiveNowPanelSkeleton from '../../../rediscord-components/islets/active-now-panel/active-now-panel-skeleton'
import DMLayoutSkeleton from '../../../rediscord-components/islets/dm-layout/dm-layout-skeleton'
import FriendListSkeleton from '../../../rediscord-components/islets/friend-list/friend-list-skeleton'
import {
  Page,
  PageContent,
  PageHeaderSkeleton,
} from '../../../rediscord-components/layout/page'

export default function SkeletonPage() {
  return (
    <DMLayoutSkeleton>
      <Page>
        <PageHeaderSkeleton />
        <PageContent className="flex-col lg:flex-row" padding="none">
          <div className="flex flex-1 px-6 pt-4">
            <FriendListSkeleton />
          </div>
          <div className="flex md:w-[360px]">
            <ActiveNowPanelSkeleton />
          </div>
        </PageContent>
      </Page>
    </DMLayoutSkeleton>
  )
}
