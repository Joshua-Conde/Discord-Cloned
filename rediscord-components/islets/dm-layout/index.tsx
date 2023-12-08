import { ListedDMChannel } from '../../../rediscord-lib/entities/channel'
import { delay } from '../../../rediscord-lib/utils'
import {
  MOCK_CHANNELS,
  MOCK_DELAY,
  generateRandomFakeChannels,
} from '../../../rediscord-lib/utils/mock'
import Header from '../../layout/header'
import Sidebar from '../../layout/sidebar'
import DMChannelList from '../dm-channel-list'
import DMHeaderMenu from '../dm-header-menu'
import FindChatButton from '../find-chat-button'
import VoiceStatusFooter from '../voice-status-footer'

export const getData = async (): Promise<{ channels: ListedDMChannel[] }> => {
  const channels: ListedDMChannel[] = generateRandomFakeChannels(MOCK_CHANNELS)
  await delay(MOCK_DELAY)
  return { channels }
}

export default async function DMLayout({ children }: React.PropsWithChildren) {
  const { channels } = await getData()
  return (
    <>
      <Sidebar className="bottom-70 flex flex-col">
        <Header verticalPadding="2" className="bg-midground">
          <FindChatButton />
        </Header>
        <div className="hover-scrollbar flex-1 overflow-y-auto py-2 pl-2 pr-0.5">
          <DMHeaderMenu />
          <DMChannelList channelsData={channels} />
        </div>
        <VoiceStatusFooter />
      </Sidebar>
      {children}
    </>
  )
}
