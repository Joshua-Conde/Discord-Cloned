import { NextResponse } from 'next/server'
import currentProfile from '../../../../lib/current-profile'
import { redirectToSignIn } from '@clerk/nextjs'
import { db } from '../../../../lib/db'

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } },
) {
  try {
    const profile = await currentProfile()
    const { name, imageUrl } = await req.json()

    if (!profile) {
      // no return redirectToSignIn()?
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // no findUnique? he just goes STRAIGHT to updating the sever
    const server = await db.server.update({
      where: {
        id: params.serverId,
        profileId: profile.id, // this is, again, only for ADMIN-ONLY ACCESS
      },
      data: {
        name,
        imageUrl,
      },
    })

    return NextResponse.json(server)
  } catch (error) {
    console.log('/api/servers/[serverId]/route.tsx: ', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
