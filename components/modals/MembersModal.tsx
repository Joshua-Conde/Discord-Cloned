'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { useModal } from '../../hooks/use-modal-store'

import { useState } from 'react'

import {
  Check,
  Gavel,
  Loader2,
  MoreVertical,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
} from 'lucide-react'

import { ServerWithMembersAndProfiles } from '../../types'
import { ScrollArea } from '../ui/scroll-area'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'

import UserAvatar from '../UserAvatar'

import { MemberRole } from 'prisma/prisma-client'

import qs from 'query-string'

import axios from 'axios'

import { useRouter } from 'next/navigation'

const roleIconMap = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="h-4 w-4 text-indigo-500" />, // ml-2
  ADMIN: <ShieldAlert className="h-4 w-4 text-rose-500" />,
}

export default function MembersModal() {
  const { type, data, isOpen, onOpen, onClose } = useModal()
  const [loadingId, setLoadingId] = useState('')
  const router = useRouter()

  const { server } = data as { server: ServerWithMembersAndProfiles } // data.server, being of type Server, has no working knowledge of its members, their profiles, and the channels that it holds ^
  const isModalOpen = isOpen && type === 'members'

  const onRoleChange = async (memberId: string, role: MemberRole) => {
    try {
      setLoadingId(memberId)

      // npm install query-string. it'll help us generate url queries
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server?.id, // is this space only needed for our having the freedom to pass in any dynamic route segments that wouldn't normally be accessible from within the route handler corresponding to this custom, api endpoint?

          // memberId, -> this isn't needed thanks to the above `${memberId}`
        },
      })

      const response = await axios.patch(url, { role }) // this is an object literal with a standalone "role" property/value
      // axios.patch REQUIRES that we give it (as a second argument) an object of some sort

      router.refresh()

      onOpen('members', { server: response.data })
    } catch (error) {
      console.log(error)
    } finally {
      setLoadingId('')
    }
  }

  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={onClose}
    >
      <DialogContent className="bg-white text-black overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Manage Members
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            {server?.members?.length} Members
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-8 max-h-[420px] pr-6">
          {server?.members?.map((member) => (
            <div
              key={member.id}
              className="flex items-center gap-x-2 mb-6"
            >
              <UserAvatar src={member.profile.imageUrl} />
              <div className="flex flex-col gap-y-1">
                <div className="text-xs font-semibold flex items-center gap-x-1">
                  {member.profile.name}
                  {roleIconMap[member.role]}
                </div>
                <p className="text-xs text-zinc-500">{member.profile.email}</p>
              </div>
              {server.profileId !== member.profileId &&
                loadingId !== member.id && (
                  <div className="ml-auto">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <MoreVertical className="h-4 w-4 text-zinc-500" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="left">
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger className="flex items-center">
                            <ShieldQuestion className="w-4 h-4 mr-2" />
                            <span>Role</span>
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              <DropdownMenuItem
                                onClick={() => onRoleChange(member.id, 'GUEST')}
                              >
                                <Shield className="h-4 w-4 mr-2" />
                                Guest
                                {member.role === 'GUEST' && (
                                  <Check className="h-4 w-4 ml-auto" /> // is there a way to increase the ml, here?
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  onRoleChange(member.id, 'MODERATOR')
                                }
                              >
                                <ShieldCheck className="h-4 w-4 mr-2" />
                                Moderator
                                {member.role === 'MODERATOR' && (
                                  <Check className="h-4 w-4 ml-auto" />
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                        // onClick={() => onKick(member.id)}
                        >
                          <Gavel className="h-4 w-4 mr-2" />
                          Kick
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              {/* !=== results in the below's seemingly-endless cyclical spinning */}
              {loadingId === member.id && (
                <Loader2 className="animate-spin text-zinc-500 ml-auto w-4 h-4" />
              )}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
