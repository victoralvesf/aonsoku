import { TooltipPortal } from '@radix-ui/react-tooltip'
import { ReactNode } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './tooltip'

interface TooltipContent {
  children: ReactNode
  text: string
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'center' | 'end' | 'start'
  delay?: number
  avoidCollisions?: boolean
}

export function SimpleTooltip({
  children,
  text,
  side = 'top',
  align = 'center',
  delay = 700,
  avoidCollisions = true,
}: TooltipContent) {
  return (
    <TooltipProvider delayDuration={delay}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipPortal>
          <TooltipContent
            side={side}
            avoidCollisions={avoidCollisions}
            align={align}
          >
            <p className="font-normal max-w-md text-center">{text}</p>
          </TooltipContent>
        </TooltipPortal>
      </Tooltip>
    </TooltipProvider>
  )
}
