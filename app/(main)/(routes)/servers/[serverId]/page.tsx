import { redirectToSignIn } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import currentProfile from '../../../../../lib/current-profile'

type ServerIDPageProps = {
  params: {
    serverId: string
  }
}

export default async function ServerIDPage({ params }: ServerIDPageProps) {
  const profile = await currentProfile()

  if (!profile) {
    return redirectToSignIn()
  }

  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
    include: {
      channels: {
        where: {
          name: 'general',
        },
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
  })

  const initialChannel = server?.channels[0]

  if (initialChannel?.name !== 'general') {
    return null
  }

  return redirect(`/servers/${params?.serverId}/channels/${initialChannel?.id}`)
}
