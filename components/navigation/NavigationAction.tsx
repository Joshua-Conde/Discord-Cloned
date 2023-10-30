'use client'

import { Plus } from 'lucide-react'
import ActionTooltip from '../ActionTooltip'
import { useModal } from '../../hooks/use-modal-store'

export default function NavigationAction() {
  const { onOpen } = useModal()

  return (
    <div>
      <ActionTooltip
        label="Add a server"
        side="right"
        align="center"
      >
        <button
          className="group flex items-center"
          onClick={() => onOpen('createServer')}
        >
          <div className="flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-background dark:bg-neutral-700 group-hover:bg-emerald-500">
            <Plus
              className="group-hover:text-white transition text-emerald-500"
              size={25}
            />
            {/* at this point in time is when i found the need to define <ActionTooltip />; (it, a child to the above div, just wraps the below content(s)) */}
          </div>
        </button>
      </ActionTooltip>
    </div>
  )
}
