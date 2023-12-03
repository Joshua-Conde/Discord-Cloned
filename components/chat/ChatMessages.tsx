'use client'

import { Member, Message, Profile } from 'prisma/prisma-client'
import { ChatWelcome } from './ChatWelcome'
import { useChatQuery } from '../../hooks/use-chat-query'
import { Loader2, ServerCrash } from 'lucide-react'
import { Fragment } from 'react'
import ChatItem from './ChatItem'
import { format } from 'date-fns'

const DATE_FORMAT = 'd MMM yyyy, HH:mm'

type MessageWithMemberAndProfile = Message & {
  member: Member & {
    profile: Profile
  }
}

// "pages" query: Record<string, any> = outbound
// "app" query: Record<string, string> = inbound batch

type ChatMessagesProps = {
  member: Member
  name: string
  type: 'channel' | 'conversation'
  chatId: string
  paramKey: 'channelId' | 'conversationId'
  paramValue: string
  apiUrl: string // "app" router (from where to fetch all (including old) messages)
  socketUrl: string // "pages" router (from where we trigger a sending of new messages)
  socketQuery: Record<string, string>
}

export default function ChatMessages({
  member,
  name,
  type,
  chatId,
  paramKey,
  paramValue,
  apiUrl,
  socketUrl,
  socketQuery,
}: ChatMessagesProps) {
  const queryKey = `chat:${chatId}`

  const { data, status, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useChatQuery({
      queryKey,
      apiUrl,
      paramKey,
      paramValue,
    })

  // (status === loading)
  if (status === 'pending') {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Loading messages...
        </p>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <ServerCrash className="h-7 w-7 text-zinc-500 my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Something went wrong!
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-1 py-4 overflow-y-auto">
      <div className="flex-1" />
      <ChatWelcome
        name={name}
        type={type}
      />
      <div className=" flex flex-col-reverse mt-auto">
        {data?.pages?.map((page, index) => (
          <Fragment key={index}>
            {page?.items?.map((message: MessageWithMemberAndProfile) => (
              <ChatItem
                key={message?.id}
                id={message?.id}
                content={message?.content}
                fileUrl={message?.fileUrl}
                timestamp={format(new Date(message?.createdAt), DATE_FORMAT)}
                isUpdated={message?.updatedAt !== message?.createdAt}
                deleted={message?.deleted}
                member={message?.member}
                currentMember={member}
                socketUrl={socketUrl}
                socketQuery={socketQuery}
              />
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  )
}
