import { BsFillChatLeftTextFill, BsX } from 'react-icons/bs'
import { ListItem } from '../../ui/list'
import { ListedDMChannel } from '../../../rediscord-lib/entities/channel'
import Avatar from '../../ui/avatar'

type DMChannelListItemProps = {
  active?: boolean
  channel: ListedDMChannel
  onDelete: () => void
}

export default function DMChannelListItem({
  active,
  channel,
  onDelete,
}: DMChannelListItemProps) {
  return (
    <ListItem
      noVerticalPadding
      active={active}
      href={`/channels/${channel.id}`}
      className="group gap-3 py-1.5"
    >
      <Avatar
        src={channel.avatar}
        alt={channel.name}
        status={channel.status}
        className="w-8 flex-none"
      />
      <div className="flex-1 truncate text-sm">
        {channel.name}
        {channel.activity && (
          <div className="h-4 truncate text-xs leading-3">
            <span className="capitalize">{channel.activity?.type}</span>{' '}
            {channel.activity?.name}{' '}
            <BsFillChatLeftTextFill
              fontSize={10}
              className="ml-0.5 inline-block"
            />
          </div>
        )}
      </div>
      <button
        onClick={(event) => {
          event.preventDefault()
          onDelete()
        }}
        className="hidden text-gray-300 hover:text-white group-hover:block"
      >
        <BsX fontSize={24} />
      </button>
    </ListItem>
  )
}
