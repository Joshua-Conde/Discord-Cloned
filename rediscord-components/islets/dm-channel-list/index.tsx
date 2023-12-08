'use client'
import React from 'react'
import DMChannelListHeader from './dm-channel-list-header'
import DMChannelListItem from './dm-channel-list-item'
import { useParams } from 'next/navigation'
import { ListedDMChannel } from '../../../rediscord-lib/entities/channel'
import { useChannelStore } from '../../../rediscord-state/channel-list'
import { List } from '../../ui/list'

interface DMChannelListrops {
  channelsData: ListedDMChannel[]
}
export default function DMChannelList({ channelsData }: DMChannelListrops) {
  const { channels, setChannels } = useChannelStore()

  React.useEffect(() => {
    if (channelsData) {
      setChannels(channelsData)
    }
  }, [])

  const handleChannelDelete = (channelId: string) => {
    if (channels !== null) {
      setChannels(channels.filter((channel) => channel.id !== channelId))
    }
  }
  const params = useParams()

  return (
    <div className="pt-4">
      <DMChannelListHeader />
      <List className="mt-1">
        {channels?.map((channel) => (
          <DMChannelListItem
            active={params?.id === channel.id}
            key={channel.id}
            channel={channel}
            onDelete={() => {
              handleChannelDelete(channel.id)
            }}
          />
        ))}
      </List>
    </div>
  )
}
