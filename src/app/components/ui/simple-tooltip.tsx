import { ReactNode } from "react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip"

interface TooltipContent {
  children: ReactNode
  text: string
  side?: "top" | "right" | "bottom" | "left"
}

export function SimpleTooltip({ children, text, side = "top" }: TooltipContent) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent side={side}>
          <p className="font-normal">{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
