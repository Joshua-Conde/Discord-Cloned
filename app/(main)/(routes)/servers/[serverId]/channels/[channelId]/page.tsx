import { redirectToSignIn } from '@clerk/nextjs'
import currentProfile from '../../../../../../../lib/current-profile'
import { db } from '../../../../../../../lib/db'
import { redirect } from 'next/navigation'
import ChatHeader from '../../../../../../../components/chat/ChatHeader'

type ChannelIDPageProps = {
  params: {
    serverId: string
    channelId: string
  }
}

export default async function ChannelIDPage({ params }: ChannelIDPageProps) {
  const profile = await currentProfile()

  if (!profile) {
    return redirectToSignIn()
  }

  const channel = await db.channel.findUnique({
    // why aren't we, instead, using findFirst? our schema.prisma doesn't leverage an "@unique" ANYWHERE within the "Channel" model
    where: {
      id: params?.channelId,
    },
  })

  const member = await db.member.findFirst({
    // but, here, we invoke findFirst...
    where: {
      serverId: params?.serverId,
      profileId: profile?.id,
    },
  })

  if (!channel || !member) {
    return redirect('/') // is redirect('/') === return redirect('/')?
  }

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        serverId={channel?.serverId}
        name={channel?.name}
        type="channel"
      />
    </div>
  )
}