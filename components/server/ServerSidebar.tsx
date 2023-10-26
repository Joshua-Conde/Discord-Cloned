import { redirectToSignIn } from '@clerk/nextjs'
import { ChannelType } from '@prisma/client'
import currentProfile from '../../lib/current-profile'
import { db } from '../../lib/db'
import { redirect } from 'next/navigation'
import ServerHeader from './ServerHeader'

type ServerSidebarProps = {
  serverId: string
}

export default async function ServerSidebar({ serverId }: ServerSidebarProps) {
  const profile = await currentProfile()

  if (!profile) {
    return redirectToSignIn() // why, here, does he do a regular redirect? the one from "next/navigation"
  }

  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      // an inevitable "include"?
      channels: {
        orderBy: {
          createdAt: 'asc',
        },
      },
      members: {
        include: {
          // and a non-inevitable, nested "include"?
          profile: true, // what does "profile" even mean, here? does it refer to the same "profile" received from the call to currentProfile()?
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
  ) // we could care less about rendering ourselves in the list

  const textChannel = server?.channels.filter(
    (channel) => channel.type === ChannelType.TEXT,
  )
  const audioChannel = server?.channels.filter(
    (channel) => channel.type === ChannelType.AUDIO,
  )
  const videoChannel = server?.channels.filter(
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
    </div>
  )
}
