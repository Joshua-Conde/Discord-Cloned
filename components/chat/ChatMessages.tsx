"use client";

import { Member, Message, Profile } from "prisma/prisma-client";
import { ChatWelcome } from "./ChatWelcome";
import { useChatQuery } from "../../hooks/use-chat-query";
import { Loader2, ServerCrash } from "lucide-react";
import { Fragment, useRef, ElementRef } from "react";
import ChatItem from "./ChatItem";
import { format } from "date-fns";
import { useChatSocket } from "../../hooks/use-chat-socket";
import { useChatScroll } from "../../hooks/use-chat-scroll";

const DATE_FORMAT = "d MMM yyyy, HH:mm";

type MessageWithMemberAndProfile = Message & {
  member: Member & {
    profile: Profile;
  };
};

// Record<string, string> & Record<string, any>(as of now) are BOTH assigned to their holding { channelId: channel?.id, serverId: channel?.serverId }

type ChatMessagesProps = {
  member: Member;
  name: string;
  type: "channel" | "conversation";
  chatId: string;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
  apiUrl: string; // "app" router (from where to fetch all (including old) messages)
  socketUrl: string; // "pages" router (from where we trigger a sending of new messages)
  socketQuery: Record<string, string>;
};

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
  const queryKey = `chat:${chatId}`;
  const addKey = `chat:${chatId}:messages`;
  const updateKey = `chat:${chatId}:messages:update`;

  const { data, status, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useChatQuery({
      queryKey,
      apiUrl,
      paramKey,
      paramValue,
    });

  // console.log(data?.pages?.[0]?.items?.[0]) -> the structuring of a message instance (the most recent message appears first - console ninja)

  useChatSocket({ queryKey, addKey, updateKey });

  const topRef = useRef<ElementRef<"div">>(null);
  const bottomRef = useRef<ElementRef<"div">>(null);

  useChatScroll({
    topRef,
    bottomRef,
    loadMore: fetchNextPage,
    shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
    count: data?.pages?.[0]?.items?.length ?? 0,
  });

  // (status === loading)
  if (status === "pending") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Loading messages...
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <ServerCrash className="h-7 w-7 text-zinc-500 my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Something went wrong!
        </p>
      </div>
    );
  }

  return (
    <div ref={topRef} className="flex-1 flex flex-col py-4 overflow-y-auto">
      {!hasNextPage && <div className="flex-1" />}
      {!hasNextPage && <ChatWelcome type={type} name={name} />}
      {hasNextPage && (
        <div className="flex justify-center">
          {isFetchingNextPage ? (
            <Loader2 className="h-6 w-6 text-zinc-500 animate-spin my-4" />
          ) : (
            <button
              onClick={() => fetchNextPage()}
              className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 text-xs my-4 dark:hover:text-zinc-300 transition"
            >
              Load previous messages
            </button>
          )}
        </div>
      )}
      <div className="flex flex-col-reverse mt-auto">
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
      <div ref={bottomRef} />
    </div>
  );
}
