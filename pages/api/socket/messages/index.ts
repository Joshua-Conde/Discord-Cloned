import { NextApiRequest } from 'next'
import { NextApiResponseServerIo } from '@/types'
import { db } from '@/lib/db'
import currentProfilePages from '../../../../lib/current-profile-pages'

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

    const { serverId, channelId } = req?.query

    if (!serverId) {
      return res?.status(400)?.json({ error: 'Server ID missing' })
    }

    if (!channelId) {
      return res?.status(400)?.json({ error: 'Channel ID missing' })
    }

    const { content, fileUrl } = req?.body

    if (!content) {
      return res?.status(400)?.json({ error: 'Content missing' })
    }

    const server = await db?.server?.findFirst({
      where: {
        id: serverId as string,
        members: {
          some: {
            profileId: currentProfile?.id,
          },
        },
      },
      include: {
        members: true,
      },
    })

    if (!server) {
      return res?.status(404)?.json({ error: 'Server not found' })
    }

    const channel = await db?.channel?.findFirst({
      where: {
        id: channelId as string,
        serverId: serverId as string,
      },
    })

    if (!channel) {
      return res?.status(404)?.json({ error: 'Channel not found' })
    }

    const currentMember = server?.members?.find(
      (member) => member?.profileId === currentProfile?.id,
    )

    if (!currentMember) {
      return res?.status(404)?.json({ error: 'Member not found' })
    }

    const message = await db.message.create({
      data: {
        content,
        fileUrl,
        channelId: channelId as string,
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

    const channelKey = `chat:${channelId}:messages`

    res?.socket?.server?.io?.emit(channelKey, message)

    return res?.status(200)?.json(message)
  } catch (error) {
    console.log('/pages/api/socket/messages/index.ts: ', error)
    return res?.status(500)?.json({ message: 'Internal Error' })
  }
}
