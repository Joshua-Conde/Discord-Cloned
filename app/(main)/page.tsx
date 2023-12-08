import { redirectToSignIn } from '@clerk/nextjs'
import { User } from '../../rediscord-lib/entities/user'
import currentProfile from '../../lib/current-profile'
import { BsPersonFill } from 'react-icons/bs'
import Divider from '../../rediscord-components/ui/divider'
import FriendsTabGroup from '../../rediscord-components/islets/friends-tab-group'
import FriendList from '../../rediscord-components/islets/friend-list'
import ActiveNowPanel from '../../rediscord-components/islets/active-now-panel'

import {
  MOCK_DELAY,
  MOCK_FRIENDS,
  generateRandomFakeUsers,
} from '../../rediscord-lib/utils/mock'
import { delay } from '../../rediscord-lib/utils'
import {
  Page,
  PageContent,
  PageHeader,
} from '../../rediscord-components/layout/page'

interface FriendFetchData {
  friends: User[]
  friendRequests: User[]
  blockedFriends: User[]
}
const getData = async (): Promise<FriendFetchData> => {
  /*
   * Generating fake users for test
   */
  const friends: User[] = generateRandomFakeUsers(MOCK_FRIENDS)
  const friendRequests: User[] = generateRandomFakeUsers(6)
  const blockedFriends: User[] = []

  await delay(MOCK_DELAY)
  return { friends, friendRequests, blockedFriends }
}

export default async function ServerIDPage() {
  const profile = await currentProfile()

  if (!profile) {
    return redirectToSignIn()
  }

  const data = await getData()

  return (
    <Page>
      <PageHeader>
        <div className="flex gap-4">
          <div className="flex flex-none items-center gap-2 text-sm font-semibold">
            <BsPersonFill className="text-gray-500" fontSize={22} />
            Friends
          </div>
          <Divider vertical />
          <FriendsTabGroup />
        </div>
      </PageHeader>
      <PageContent className="flex-col lg:flex-row" padding="none">
        <div className="flex flex-1 px-6 pt-4">
          <FriendList {...data} />
        </div>
        <div className="flex md:w-[360px]">
          <ActiveNowPanel />
        </div>
      </PageContent>
    </Page>
  )
}
