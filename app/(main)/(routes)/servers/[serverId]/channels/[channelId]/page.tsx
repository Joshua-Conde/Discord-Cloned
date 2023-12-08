import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { ChannelType } from "prisma/prisma-client";
import { MediaRoom } from "../../../../../../../components/MediaRoom";
import ChatHeader from "../../../../../../../components/chat/ChatHeader";
import ChatInput from "../../../../../../../components/chat/ChatInput";
import ChatMessages from "../../../../../../../components/chat/ChatMessages";
import currentProfile from "../../../../../../../lib/current-profile";
import { db } from "../../../../../../../lib/db";

type ChannelIDPageProps = {
  params: {
    serverId: string;
    channelId: string;
  };
};

export default async function ChannelIDPage({ params }: ChannelIDPageProps) {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const channel = await db.channel.findUnique({
    // why aren't we, instead, using findFirst? our schema.prisma doesn't leverage an "@unique" ANYWHERE within the "Channel" model
    where: {
      id: params?.channelId,
    },
  });

  const member = await db.member.findFirst({
    // but, here, we invoke findFirst...
    where: {
      serverId: params?.serverId,
      profileId: profile?.id,
    },
  });

  if (!channel || !member) {
    return redirect("/"); // is redirect('/') === return redirect('/')?
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#313338]">
      <ChatHeader
        name={channel?.name}
        type="channel"
        serverId={channel?.serverId}
      />
      {channel?.type === ChannelType.TEXT && (
        <>
          <ChatMessages
            member={member}
            name={channel?.name}
            type="channel"
            chatId={channel?.id}
            paramKey="channelId"
            paramValue={channel?.id}
            apiUrl="/api/messages"
            socketUrl="/api/socket/messages"
            socketQuery={{
              channelId: channel?.id,
              serverId: channel?.serverId,
            }}
          />
          <ChatInput
            name={channel?.name}
            type="channel"
            apiUrl="/api/socket/messages"
            query={{
              channelId: channel?.id,
              serverId: channel?.serverId,
            }}
          />
        </>
      )}
      {channel?.type === ChannelType.AUDIO && (
        <MediaRoom chatId={channel?.id} audio={true} video={false} />
      )}
      {channel?.type === ChannelType.VIDEO && (
        <MediaRoom chatId={channel?.id} audio={true} video={true} />
      )}
    </div>
  );
}
