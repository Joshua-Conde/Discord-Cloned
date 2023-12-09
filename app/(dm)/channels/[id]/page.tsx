import ChannelDM from '../../../../rediscord-components/islets/dm-channel'
import { Page } from '../../../../rediscord-components/layout/page'
import { ListedDMChannel } from '../../../../rediscord-lib/entities/channel'
import { User } from '../../../../rediscord-lib/entities/user'
import { delay } from '../../../../rediscord-lib/utils'
import {
  MOCK_DELAY,
  generateRandomFakeChannels,
} from '../../../../rediscord-lib/utils/mock'

export const getChannelByID = async (
  id: string,
): Promise<{ channel: User | undefined }> => {
  if (!id) throw new Error('Invalid ID')
  const channel: ListedDMChannel = generateRandomFakeChannels(1)[0]
  await delay(MOCK_DELAY)
  return { channel }
}

export default async function ChannelPage({
  params,
}: {
  params: { id: string }
}) {
  const { channel } = await getChannelByID(params.id)
  return (
    <Page>
      <ChannelDM user={channel} />
    </Page>
  )
}
