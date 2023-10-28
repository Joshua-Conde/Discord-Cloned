import { NextResponse } from 'next/server'
import currentProfile from '../../../lib/current-profile'
import { db } from '../../../lib/db'
import { MemberRole } from 'prisma/prisma-client'

export async function POST(req: Request) {
  try {
    const profile = await currentProfile() // "await" it! i don't want "profile" to be a promise. i (otherwise) wouldn't be able to obtain its id (the id of the current user)
    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { name, type } = await req.json()
    const { searchParams } = new URL(req.url)

    const serverId = searchParams.get('serverId')
    if (!serverId) {
      return new NextResponse('Server ID missing', { status: 400 })
    }

    if (name === 'general') {
      // a double-double check! a protective back-end!
      return new NextResponse("Name cannot be 'general", { status: 400 })
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.MODERATOR, MemberRole.ADMIN],
            },
          },
        },
      },
      data: {
        channels: {
          create: {
            profileId: profile.id,
            name,
            type,
          },
        },
      },
    })

    return NextResponse.json(server)
  } catch (error) {
    console.log('/api/channels/route.tsx: ', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
