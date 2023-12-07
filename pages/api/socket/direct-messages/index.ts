import { NextApiRequest } from 'next'
import currentProfilePages from '../../../../lib/current-profile-pages'
import { NextApiResponseServerIo } from '../../../../types'
import { db } from '../../../../lib/db'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo,
) {
  if (req?.method !== 'POST') {
    return res?.status(405)?.json({ error: 'Method not allowed' })
  }

  try {
    const currentProfile = await currentProfilePages(req)

    if (!currentProfile) {
      return res?.status(401)?.json({ error: 'Unauthorized' })
    }

    const { conversationId } = req?.query

    if (!conversationId) {
      return res?.status(400)?.json({ error: 'Conversation ID missing' })
    }

    const { content, fileUrl } = req?.body

    if (!content) {
      return res?.status(400)?.json({ error: 'Content missing' })
    }

    const conversation = await db?.conversation?.findFirst({
      where: {
        id: conversationId as string,
        OR: [
          {
            memberOne: {
              profileId: currentProfile?.id,
            },
          },
          {
            memberTwo: {
              profileId: currentProfile?.id,
            },
          },
        ],
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    })

    if (!conversation) {
      return res?.status(404)?.json({ error: 'Conversation not found' })
    }

    const currentMember =
      conversation?.memberOne?.profileId === currentProfile?.id
        ? conversation?.memberOne
        : conversation?.memberTwo

    if (!currentMember) {
      return res?.status(404)?.json({ error: 'Member not found' })
    }

    const directMessage = await db?.directMessage?.create({
      data: {
        content,
        fileUrl,
        conversationId: conversationId as string,
        memberId: currentMember?.id,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    })

    const conversationKey = `chat:${conversationId}:messages`

    res?.socket?.server?.io?.emit(conversationKey, directMessage)

    return res?.status(200)?.json(directMessage)
  } catch (error) {
    console.log('/pages/api/socket/direct-messages/index.ts: ', error)
    return res?.status(500)?.json({ error: 'Internal Error' })
  }
}
