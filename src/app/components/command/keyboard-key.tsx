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
        'inline-flex pointer-events-none text-muted-foreground h-5 items-center gap-1 leading-[19px] -tracking-[0.003rem]',
        'min-w-[22px] justify-center rounded border bg-background px-1 font-medium text-[0.8125rem] sm:flex select-none shadow-kbd',
        'relative -top-[1px] whitespace-pre-wrap',
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
