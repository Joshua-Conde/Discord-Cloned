'use client'

import React from 'react'
import { User } from '../../../rediscord-lib/entities/user'
import { useFriendStore } from '../../../rediscord-state/friend-list'
import { useFriendRequestStore } from '../../../rediscord-state/friendRequest-list'
import { useChannelStore } from '../../../rediscord-state/channel-list'
import { ListItem } from '../../ui/list'
import Avatar from '../../ui/avatar'
import { t } from '../../../rediscord-lib/i18n'
import RoundedButton from '../../ui/button/rounded-button'

import {
  BsChatLeftFill,
  BsCheck2,
  BsThreeDotsVertical,
  BsX,
} from 'react-icons/bs'

import {
  FriendsTab,
  FriendsTabEnum,
} from '../../../rediscord-lib/types/friend-tab-prop'

interface FriendListItemProps {
  friend: User
  tab: FriendsTab
}

export default function FriendListItem({ friend, tab }: FriendListItemProps) {
  const { friends, setFriends } = useFriendStore()
  const { friendRequest, setFriendRequests } = useFriendRequestStore()
  const { channels, setChannels } = useChannelStore()

  const handleAcceptFriends = () => {
    if (friends !== null && friendRequest !== null) {
      setFriendRequests(friendRequest.filter((item) => item.id !== friend.id))
      setFriends([...friends, friend])
    }
  }

  const handleDeclineFriends = () => {
    if (friendRequest !== null) {
      setFriendRequests(friendRequest.filter((item) => item.id !== friend.id))
    }
  }
  const handleAddChannel = () => {
    if (channels !== null) {
      const isFriendAlreadyAdded = channels.some(
        (channel) => channel.id === friend.id,
      )
      if (!isFriendAlreadyAdded) {
        setChannels([friend, ...channels])
      }
    }
  }
  return (
    <ListItem
      href={tab.key === FriendsTabEnum.Pending ? '' : `/channels/${friend.id}`}
      className={`group justify-between border-t-[1px] border-gray-800 py-2.5 pr-3 `}
      noVerticalPadding
    >
      <div className="flex items-center gap-3">
        <Avatar
          src={friend.avatar}
          alt={friend.name}
          className="flex-none"
          status={
            tab.key === FriendsTabEnum.Pending ? undefined : friend.status
          }
        />
        <div className="flex-1 leading-4">
          <div className="flex items-center gap-1.5 text-sm text-gray-200">
            <span className="font-semibold">{friend.name}</span>
            <span className="hidden text-xs text-gray-400 group-hover:block">
              {friend.username}
            </span>
          </div>
          <div className="text-[13px] text-gray-300">
            {tab.key === FriendsTabEnum.Pending
              ? 'Incoming Friend Request'
              : t(`user.status.${friend.status}`)}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2.5">
        {tab.key === FriendsTabEnum.Pending ? (
          <>
            <RoundedButton
              className="!p-1.5"
              onClick={handleAcceptFriends}
              tooltipContent="Accept"
            >
              <BsCheck2 size={23} />
            </RoundedButton>
            <RoundedButton
              onClick={handleDeclineFriends}
              className="!p-1.5"
              tooltipContent="Decline"
            >
              <BsX size={23} />
            </RoundedButton>
          </>
        ) : (
          <>
            <RoundedButton onClick={handleAddChannel} tooltipContent="Message">
              <BsChatLeftFill />
            </RoundedButton>
            <RoundedButton tooltipContent="More">
              <BsThreeDotsVertical />
            </RoundedButton>
          </>
        )}
      </div>
    </ListItem>
  )
}
