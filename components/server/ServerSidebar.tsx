import { redirectToSignIn } from '@clerk/nextjs'
import { ChannelType, MemberRole } from '@prisma/client'
import currentProfile from '../../lib/current-profile'
import { db } from '../../lib/db'
import { redirect } from 'next/navigation'
import ServerHeader from './ServerHeader'
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from 'lucide-react'
import { ScrollArea } from '../ui/scroll-area'
import ServerSearch from './ServerSearch'

type ServerSidebarProps = {
  serverId: string
}

const iconMap = {
  [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
  [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
  [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />,
}

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="h-4 w-4 mr-2 text-indigo-500" />
  ),
  [MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 mr-2 text-rose-500" />,
}

export default async function ServerSidebar({ serverId }: ServerSidebarProps) {
  const profile = await currentProfile()

  if (!profile) {
    return redirectToSignIn()
  }

  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      // a server "include"
      channels: {
        orderBy: {
          createdAt: 'asc',
        },
      },
      members: {
        include: {
          // a nested, member "include"
          profile: true, // what does "profile" even mean, here? does it refer to the same "profile" received from the above call to currentProfile()?
        },
        orderBy: {
          role: 'asc',
        },
      },
    },
  })

  if (!server) {
    redirect('/')
  }

  const members = server?.members.filter(
    (member) => member.profileId !== profile.id,
  ) // we could care less about rendering ourselves in this list

  const textChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.TEXT,
  )
  const audioChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.AUDIO,
  )
  const videoChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.VIDEO,
  )

  const role = server?.members.find(
    (member) => member.profileId === profile.id,
  )?.role // what's our role?

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <ServerHeader
        server={server}
        role={role}
      />
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <ServerSearch
            data={[
              {
                label: 'Text Channels',
                type: 'channel',
                data: textChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: 'Voice Channels',
                type: 'channel',
                data: audioChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: 'Video Channels',
                type: 'channel',
                data: videoChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: 'Members',
                type: 'member',
                data: members?.map((member) => ({
                  id: member.id,
                  name: member.profile.name,
                  icon: roleIconMap[member.role],
                })),
              },
            ]}
          />
        </div>
      </ScrollArea>
    </div>
  )
}
