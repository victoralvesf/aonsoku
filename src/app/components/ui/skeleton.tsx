import { cn } from '@/lib/utils'

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-foreground/20 dark:bg-accent',
        className,
      )}
      {...props}
    />
  )
}

export { Skeleton }
