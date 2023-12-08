import { NextResponse } from "next/server";
import { DirectMessage } from "prisma/prisma-client";
import currentProfile from "../../../lib/current-profile";
import { db } from "../../../lib/db";
import { NextApiResponseServerIo } from "../../../types";

const MESSAGES_BATCH = 10;

export async function GET(req: Request, res: NextApiResponseServerIo) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);

    const cursor = searchParams.get("cursor"); // "use-chat-query.ts" (nicely) supplies us with this!

    const conversationId = searchParams.get("conversationId");

    if (!conversationId) {
      return new NextResponse("Conversation ID missing", { status: 400 });
    }

    let directMessages: DirectMessage[] = [];

    if (cursor) {
      directMessages = await db.directMessage.findMany({
        take: MESSAGES_BATCH,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          conversationId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      directMessages = await db.directMessage.findMany({
        take: MESSAGES_BATCH,
        where: {
          conversationId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    let nextCursor = null;

    if (directMessages?.length === MESSAGES_BATCH) {
      nextCursor = directMessages[MESSAGES_BATCH - 1]?.id;
    }

    // socket?.io?.emits are ONLY initiated within the route handlers housed inside of the "pages" router -> outbound messages

    return NextResponse.json({
      items: directMessages,
      nextCursor,
    });
  } catch (error) {
    console.log("/app/api/direct-messages/route.ts: ", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
