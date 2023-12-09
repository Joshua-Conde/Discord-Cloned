import {
  Page,
  PageContent,
  PageHeaderSkeleton,
} from '../../../../rediscord-components/layout/page'
import TextSkeleton from '../../../../rediscord-components/ui/text/text-skeleton'

export default function MePageSkeleton() {
  return (
    <Page>
      <PageHeaderSkeleton gap="4" boxSkeletonType="avatar" />
      <PageContent>
        <TextSkeleton length={15} />
      </PageContent>
    </Page>
  )
}
