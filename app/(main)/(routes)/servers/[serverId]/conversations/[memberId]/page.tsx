import { redirectToSignIn } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { findOrCreateConversation } from '@/lib/conversation'
import currentProfile from '@/lib/current-profile'
import ChatHeader from '../../../../../../../components/chat/ChatHeader'
import ChatMessages from '../../../../../../../components/chat/ChatMessages'
import ChatInput from '../../../../../../../components/chat/ChatInput'
import { MediaRoom } from '../../../../../../../components/MediaRoom'

type MemberIDPageProps = {
  params: {
    serverId: string
    memberId: string
  }
  searchParams: {
    video?: boolean
  }
}

export default async function MemberIDPage({
  params,
  searchParams,
}: MemberIDPageProps) {
  const profile = await currentProfile()

  if (!profile) {
    return redirectToSignIn()
  }

  const currentMember = await db?.member?.findFirst({
    where: {
      serverId: params?.serverId,
      profileId: profile?.id,
    },
    include: {
      profile: true,
    },
  })

  if (!currentMember) {
    return redirect('/')
  }

  const conversation = await findOrCreateConversation(
    currentMember?.id,
    params?.memberId,
  )

  if (!conversation) {
    return redirect(`/servers/${params?.serverId}`)
  }

  const { memberOne, memberTwo } = conversation

  const otherMember =
    memberOne?.profileId === profile?.id ? memberTwo : memberOne // before: currentProfile?.id; (didn't work)

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        serverId={params?.serverId}
        name={otherMember?.profile?.name}
        type="conversation"
        imageUrl={otherMember?.profile?.imageUrl}
      />
      {searchParams?.video && (
        <MediaRoom
          chatId={conversation?.id}
          audio={true}
          video={true}
        />
      )}
      {!searchParams?.video && (
        <>
          <ChatMessages
            member={currentMember}
            name={otherMember?.profile?.name}
            type="conversation"
            chatId={conversation?.id}
            paramKey="conversationId"
            paramValue={conversation?.id}
            apiUrl="/api/direct-messages"
            socketUrl="/api/socket/direct-messages"
            socketQuery={{
              conversationId: conversation?.id,
            }}
          />
          <ChatInput
            name={otherMember?.profile?.name}
            type="conversation"
            apiUrl="/api/socket/direct-messages"
            query={{
              conversationId: conversation?.id,
            }}
          />
        </>
      )}
    </div>
  )
}
