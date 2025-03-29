import { cn } from '@/lib/utils'

interface KeyboardProps {
  modifier?: string
  text: string
  className?: string
}

export function Keyboard({ modifier, text, className = '' }: KeyboardProps) {
  return (
    <kbd
      className={cn(
        'pointer-events-none text-muted-foreground h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[12px] font-medium sm:flex',
        className,
      )}
    >
      {modifier !== undefined && (
        <span className="text-[11px]">{modifier}</span>
      )}
      {text}
    </kbd>
  )
}
