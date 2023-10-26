import { redirectToSignIn } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

import ServerSidebar from '../../../../../components/server/ServerSidebar'
import currentProfile from '../../../../../lib/current-profile'
import { db } from '../../../../../lib/db'

export default async function ServerIDLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { serverId: string }
}) {
  const profile = await currentProfile()

  if (!profile) {
    return redirectToSignIn()
    // how does this differ from the "@clert/nextjs" version?
    // is the "return," too, really necessary? this should take care of the my needing to worry about
    // the continued excution of the function, right?
  }

  const server = await db.server.findUnique({
    // any seen, serverId's will be unique!
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  })

  if (!server) {
    redirect('/')
  }

  return (
    <div className="h-full">
      <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
        <ServerSidebar serverId={params.serverId} />
      </div>
      <main className="h-full md:pl-60">{children}</main>
    </div>
  )
}
