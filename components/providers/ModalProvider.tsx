'use client'
import { useEffect, useState } from 'react'

import CreateServerModal from '../modals/CreateServerModal'
import InviteModal from '../modals/InviteModal'
import EditServerModal from '../modals/EditServerModal'
import MembersModal from '../modals/MembersModal'
import CreateChannelModal from '../modals/CreateChannelModal'

export default function ModalProvider() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  // our modals will never be rendered unless contained inside of <ModalProvider />

  return (
    <>
      <CreateServerModal />
      <InviteModal />
      <EditServerModal />
      <MembersModal />
      <CreateChannelModal />
    </>
  )
}
