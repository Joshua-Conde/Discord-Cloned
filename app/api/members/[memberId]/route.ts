import { NextResponse } from 'next/server'
import currentProfile from '../../../../lib/current-profile'
import { db } from '../../../../lib/db'

export async function PATCH( // a NAMED export is required -> a default export is forbidden
  req: Request,
  { params }: { params: { memberId: string } },
) {
  try {
    const profile = await currentProfile()
    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { searchParams } = new URL(req.url) // this is thanks to query-string
    const { role } = await req.json()

    const serverId = searchParams.get('serverId')
    if (!serverId) {
      return new NextResponse('Server ID missing', { status: 400 })
    }

    if (!params.memberId) {
      // this .memberId comes from the "above" dynamic route segment
      return new NextResponse('Member ID missing', { status: 400 })
    }

    const server = await db.server.update({
      where: {
        id: serverId, // this is thanks to "query-string," which allows our being able to access other dynamic route segments besides the one we're currently in (memberId)
        profileId: profile.id, // this confirms that ONLY the admin can change the role of a server member
      },
      data: {
        members: {
          update: {
            where: {
              id: params.memberId,
              profileId: {
                not: profile.id, // this is our protecting the admin against their being able to (accidentally) alter their own role
              },
            },
            data: {
              role, // this role will, per his words, be passed in as its being either "MODERATOR" or "ADMIN"
            },
          },
        },
      },
      include: {
        // this is for our being able to uphold a close-enough to our current ordering of the members list (managed by <MembersModal />)
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: 'asc',
          },
        },
      },
    })

    return NextResponse.json(server)
  } catch (error) {
    console.log('/api/members/[memberId]/route.ts: ', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { memberId: string } },
) {
  // ANY axios calls made to custom api endpoints (and their corresponding route handlers) MUST be contained within a "try-catch-(finally)" block
  try {
    const profile = await currentProfile()

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { searchParams } = new URL(req.url) // a new URL from req.URL

    const serverId = searchParams.get('serverId') // this is spelled IDENTICALLY to how it was (originally) spelled within the query object
    // take into account, too, the fact that searchParams defines a .get() method that allows to these "external" dynamic route segments

    if (!serverId) {
      return new NextResponse('Server ID missing', { status: 400 })
    }

    if (!params.memberId) {
      // memberId cannot be ref.'d directly; only through the specified params object
      return new NextResponse('Member ID missing', { status: 400 })
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id, // this confirms (or not) our admin status?
      },
      data: {
        members: {
          delete: {
            id: params.memberId,
            profileId: {
              not: profile.id, // an admin CANNOT kick themselves!
            },
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: 'asc',
          },
        },
      },
    })

    return NextResponse.json(server)
  } catch (error) {
    console.log('/api/members/[memberId]/route.ts: ', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
