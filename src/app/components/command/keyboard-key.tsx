import { cn } from "@/lib/utils"

interface KeyboardProps {
  modifier?: string
  text: string
  className?: string
}

export function Keyboard({ modifier, text, className = '' }: KeyboardProps) {
  return (
    <kbd
      className={cn(
        "pointer-events-none absolute text-muted-foreground right-[0.5rem] top-[9px] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex",
        className
      )}
    >
      {modifier !== undefined && (
        <span className="text-xs">{modifier}</span>
      )}
      {text}
    </kbd>
  )
}