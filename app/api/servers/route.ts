import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { MemberRole } from '@prisma/client'
import currentProfile from '../../../lib/current-profile'
import { db } from '../../../lib/db'

export async function POST(req: Request) {
  try {
    const profile = await currentProfile()

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { name, imageUrl } = await req?.json()

    const server = await db?.server?.create({
      data: {
        profileId: profile?.id,
        name,
        imageUrl,
        inviteCode: uuidv4(),
        channels: {
          create: [{ profileId: profile?.id, name: 'general' }],
        },
        members: {
          create: [{ profileId: profile?.id, role: MemberRole?.ADMIN }],
        },
      },
    })

    return NextResponse?.json(server)
  } catch (error) {
    console.log('/api/servers/route.ts: ', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
