'use client'

import React, { useEffect } from 'react'
import { Input } from '@/components/ui/input'
import {
  FriendsTab,
  FriendsTabEnum,
  friendsTabsProps,
} from '../../../rediscord-lib/types/friend-tab-prop'
import { User } from '../../../rediscord-lib/entities/user'
import { normalizedCompare } from '../../../rediscord-lib/utils/string'
import InputField from '../../ui/input/input-field'
import { BsSearch, BsXLg } from 'react-icons/bs'
import clsx from '../../../rediscord-lib/clsx'
import FriendListItem from './friend-list-item'
import { EmptyBox } from '../empty-box-image'
import { useFriendsTabStore } from '../../../rediscord-state/friends-tab'
import { useFriendStore } from '../../../rediscord-state/friend-list'
import { TooltipProvider } from '../../../components/ui/tooltip'
import { List } from '../../ui/list'

interface ListDataProps {
  tab: FriendsTab
  data: User[]
}
const ListData = ({ tab, data }: ListDataProps) => {
  const [search, setSearch] = React.useState('')
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  const filteredList = data.filter((user) => {
    const isMatchingName = !search || normalizedCompare(user.name, search)
    return (
      (tab.status ? tab.status.includes(user.status) : true) && isMatchingName
    )
  })

  return (
    <>
      {!!data.length && (
        <div className="px-2 pb-5">
          <InputField
            endIcon={
              <>
                <BsSearch
                  className={clsx(
                    'absolute right-0 transition-all',
                    search ? '-rotate-90 opacity-0' : 'rotate-0 opacity-100',
                  )}
                />
                <button
                  className={clsx(
                    'absolute right-0 outline-none transition-all',
                    search ? 'rotate-0 opacity-100' : 'rotate-90 opacity-0',
                  )}
                  onClick={() => setSearch('')}
                >
                  <BsXLg />
                </button>
              </>
            }
          >
            <Input
              placeholder="Search"
              value={search}
              onChange={handleSearchChange}
            />
          </InputField>
          <div className="mt-6 text-xs font-semibold uppercase text-gray-400">
            {tab.title} — {filteredList.length}
          </div>
        </div>
      )}
      <div className="flex-1 overflow-y-scroll">
        {!!filteredList.length ? (
          <List>
            {filteredList.map((friend) => (
              <FriendListItem tab={tab} key={friend.id} friend={friend} />
            ))}
          </List>
        ) : (
          <EmptyBox
            src={tab.empty.imageSrc}
            alt={tab.empty.imageAlt}
            text={
              search ? 'Whooaps! No one found with this name' : tab.empty.text
            }
          />
        )}
      </div>
    </>
  )
}
interface FriendListProps {
  friends: User[]
  friendRequests: User[]
  blockedFriends: User[]
}
export default function FriendList({
  friends,
  friendRequests,
  blockedFriends,
}: FriendListProps) {
  const { currentTab } = useFriendsTabStore()
  const { setFriends } = useFriendStore()

  useEffect(() => {
    if (friends) {
      setFriends(friends)
    }
  }, [])

  const tab = friendsTabsProps[
    currentTab as keyof typeof friendsTabsProps
  ] as FriendsTab
  const isAllOrAvailableTab = [
    FriendsTabEnum.All,
    FriendsTabEnum.Available,
  ].includes(currentTab)

  const data = isAllOrAvailableTab
    ? friends
    : currentTab === FriendsTabEnum.Pending
      ? friendRequests
      : blockedFriends
  return (
    <div className="flex flex-1 flex-col">
      <TooltipProvider>
        <ListData key={currentTab} tab={tab} data={data || []} />
      </TooltipProvider>
    </div>
  )
}
