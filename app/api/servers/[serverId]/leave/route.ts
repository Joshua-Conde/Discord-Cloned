import { NextResponse } from 'next/server'
import currentProfile from '../../../../../lib/current-profile'
import { db } from '../../../../../lib/db'

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } },
) {
  try {
    const profile = await currentProfile()

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // is it safe to assume that our route handlers should, too, confirm that any (if any) dynamic route segments are NOT null?

    if (!params.serverId) {
      return new NextResponse('Server ID missing', { status: 400 })
    }

    const server = await db.server.update({
      where: {
        id: params.serverId,
        profileId: {
          not: profile.id, // NOT the owner
        },
        members: {
          some: {
            profileId: profile.id, // a server member
          },
        },
      },
      data: {
        members: {
          deleteMany: {
            profileId: profile.id, // removing "that" server member
          },
        },
      },
    })

    return NextResponse.json(server)
  } catch (error) {
    console.log('/api/servers/[serverId]/leave/route.ts: ', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
