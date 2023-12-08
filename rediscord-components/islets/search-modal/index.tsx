'use client'

import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'

import {
  SEARCH_MODAL_EVENT,
  SearchModalEvent,
} from '../../../rediscord-lib/events/searchModalEvent'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from '@/components/ui/dialog'

export default function SearchModal() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handleEvent = (event: Event) => {
      const { detail } = event as SearchModalEvent
      setOpen(detail.action === 'open')
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault()
        setOpen(true)
      }
    }

    window.addEventListener(SEARCH_MODAL_EVENT, handleEvent)
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener(SEARCH_MODAL_EVENT, handleEvent)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <Input placeholder="Where you want me to take you?" size={100} />
        </DialogHeader>
        <DialogDescription>
          <div className="text-xs font-semibold text-gray-400">
            LAST CHANNELS
          </div>
          <div className="text-gray-500">
            No recent channels. Start a new search.
          </div>
        </DialogDescription>
        <div className="text-xs text-gray-400">
          <strong className="text-green-400">HERE&apos;s a TIP:</strong> Write
          @, #, ! or * in the beginning of your search to limit results.
        </div>
      </DialogContent>
    </Dialog>
  )
}
