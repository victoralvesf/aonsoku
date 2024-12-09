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
}

export function SimpleTooltip({
  children,
  text,
  side = 'top',
  align = 'center',
  delay = 700,
}: TooltipContent) {
  return (
    <TooltipProvider delayDuration={delay}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipPortal>
          <TooltipContent side={side} avoidCollisions={false} align={align}>
            <p className="font-normal">{text}</p>
          </TooltipContent>
        </TooltipPortal>
      </Tooltip>
    </TooltipProvider>
  )
}
