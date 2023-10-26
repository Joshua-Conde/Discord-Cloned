'use client'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip'

type ActionTooltipProps = {
  label: string // the "pop-up's" contents,
  children: React.ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
}

export default function ActionTooltip({
  label,
  children,
  side,
  align,
}: ActionTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={50}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          side={side}
          align={align}
        >
          <p className="font-semibold text-sm capitalize">
            {label.toLowerCase()}
            {/* how come the beginning of every word remains capitalized? */}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
