'use client'
import React, { useState } from 'react'
import SideMenuItem from './side-menu-item'
import { TooltipProvider } from '@radix-ui/react-tooltip'
import { ListedServer } from '../../../rediscord-lib/entities/server'
import clsx from '../../../rediscord-lib/clsx'
import Divider from '../../ui/divider'
import { BsDiscord } from 'react-icons/bs'
import NavigationSidebar from '../../../components/navigation/NavigationSidebar'

type SideMenuTrackProps = {
  servers: ListedServer[]
}

type ServerMenuItemProps = {
  server: ListedServer
  isActive: boolean
} & React.ComponentProps<typeof SideMenuItem>

const ServerMenuItem = ({
  server,
  isActive,
  ...props
}: Omit<ServerMenuItemProps, 'tooltipContent'>) => {
  return (
    <SideMenuItem
      isActive={isActive}
      notificationCount={server.messages}
      tooltipContent={<div className="font-semibold">{server.name}</div>}
      className="mx-auto my-2"
      image={{
        url: server.photo,
        alt: server.name,
      }}
      {...props}
    />
  )
}

export default function SideMenuTrack({ servers }: SideMenuTrackProps) {
  const [active, setActive] = useState<string>('default')

  return (
    <>
      <TooltipProvider>
        {/*
          Direct messages side menu button
        */}
        <SideMenuItem
          href="/channels/me"
          onClick={() => setActive('default')}
          tooltipContent={<div className="font-semibold">Direct messages</div>}
          notificationCount={432}
          className={clsx(
            'mx-auto mb-2 flex items-center justify-center bg-foreground',
            active === 'default' ? 'bg-primary text-white' : 'text-gray-300',
          )}
          isActive={active === 'default'}
        >
          <BsDiscord fontSize={26} />
        </SideMenuItem>

        <Divider className="w-8" />

        {/*
          List of servers
        */}
        {servers?.map((server) => (
          <ServerMenuItem
            href={`/channels/${server.id}`}
            key={server.id}
            server={server}
            isActive={active === server.id}
            onClick={() => {
              setActive(server.id)
            }}
          />
        ))}
      </TooltipProvider>
    </>
  )
}
