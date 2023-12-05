import { NextApiRequest } from 'next'
import currentProfilePages from '../../../../lib/current-profile-pages'
import { db } from '../../../../lib/db'
import { NextApiResponseServerIo } from '../../../../types'
import { MemberRole } from 'prisma/prisma-client'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo,
) {
  if (req.method !== 'PATCH' && req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const currentProfile = await currentProfilePages(req)
    if (!currentProfile) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const { conversationId, directMessageId } = req.query
    if (!conversationId) {
      return res.status(400).json({ error: 'Conversation ID missing' })
    }

    const { content } = req.body

    const conversation = await db.conversation.findFirst({
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
      return res.status(404).json({ error: 'Conversation not found' })
    }

    const currentMember =
      conversation?.memberOne?.profileId === currentProfile?.id
        ? conversation?.memberOne
        : conversation?.memberTwo

    if (!currentMember) {
      return res.status(404).json({ error: 'Member not found' })
    }

    let directMessage = await db.directMessage.findFirst({
      where: {
        id: directMessageId as string,
        conversationId: conversationId as string,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    })

    if (!directMessage || directMessage?.deleted) {
      return res.status(404).json({ error: 'Message not found' })
    }

    // why are these server-specific constants kept?
    const isMessageOwner = directMessage?.memberId === currentMember?.id
    const isAdmin = currentMember?.role === MemberRole?.ADMIN
    const isModerator = currentMember?.role === MemberRole?.MODERATOR
    const canModify = isMessageOwner || isAdmin || isModerator

    if (!canModify) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    if (req.method === 'PATCH') {
      if (!isMessageOwner) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      directMessage = await db.directMessage.update({
        where: {
          id: directMessageId as string,
          conversationId: conversationId as string, // MY ADDITION
        },
        data: {
          content,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      })
    }

    if (req.method === 'DELETE') {
      directMessage = await db.directMessage.update({
        where: {
          id: directMessageId as string,
          conversationId: conversationId as string, // MY ADDITION
        },
        data: {
          content: 'This message has been deleted.',
          fileUrl: null,
          deleted: true,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      })
    }

    // what about conversation?.id?
    // is it due to our needing to cast conversationId into a string?
    const updateKey = `chat:${conversation?.id}:messages:update`

    res?.socket?.server?.io?.emit(updateKey, directMessage)

    return res.status(200).json(directMessage)
  } catch (error) {
    console.log('/pages/api/socket/messages/[directMessageId].ts: ', error)
    return res.status(500).json({ error: 'Internal Error' })
  }
}
