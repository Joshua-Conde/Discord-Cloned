import { redirect } from 'next/navigation'
import currentProfile from '../../lib/current-profile'
import { db } from '../../lib/db'

import NavigationAction from './NavigationAction'
import { Separator } from '../ui/separator'
import { ScrollArea } from '../ui/scroll-area'
import NavigationItem from './NavigationItem'
import { ModeToggle } from '../mode-toggle'
import { UserButton } from '@clerk/nextjs'

export default async function NavigationSidebar() {
  const profile = await currentProfile()

  if (!profile) {
    return redirect('/')
  }

  const servers = await db.server.findMany({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  })

  return (
    <div className="space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-[#1E1F22] bg-[#E3E5E8] py-3">
      {/* installed shadcn-ui's tooltip & separator */}
      <NavigationAction />
      <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />
      {/* installed shadcn-ui's scroll-area */}
      <ScrollArea className="flex-1 w-full">
        {servers.map((server) => (
          <div
            key={server.id}
            className="mb-4"
          >
            <NavigationItem
              id={server.id}
              name={server.name}
              imageUrl={server.imageUrl}
            />
          </div>
        ))}
      </ScrollArea>
      <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
        <ModeToggle />
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: 'h-[48px] w-[48px]', // this was done to make the <UserButton />'s size identical to the <NavigationItem /> instances
            },
          }}
        />
        {/* installed zustand */}
      </div>
    </div>
  )
}
