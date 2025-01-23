import { TooltipPortal } from '@radix-ui/react-tooltip'
import { ReactNode } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './tooltip'
import { isDesktop } from 'react-device-detect'

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
        {
          isDesktop && ( // Only show tooltips on desktop
          <TooltipPortal>
            <TooltipContent
              side={side}
              avoidCollisions={avoidCollisions}
              align={align}
            >
              <p className="font-normal max-w-md text-center">{text}</p>
            </TooltipContent>
          </TooltipPortal>
          )
        }
      </Tooltip>
    </TooltipProvider>
  )
}
