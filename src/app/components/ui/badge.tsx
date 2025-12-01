import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 drop-shadow',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground',
        neutral:
          'border-transparent bg-foreground text-background hover:bg-foreground/80',
        beta: 'border-primary/80 bg-primary/20 text-primary font-normal px-2 py-0',
        multi:
          'border-primary/80 bg-primary/60 text-primary-foreground text-xs font-light pl-2 pr-[2px] py-[2px]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

type BadgeVariantProps = VariantProps<typeof badgeVariants>
type DivProps = React.HTMLAttributes<HTMLDivElement>

export type BadgeProps = DivProps & BadgeVariantProps

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export type MultiBadgeProps = React.HTMLAttributes<HTMLDivElement> &
  BadgeVariantProps & {
    label?: string | React.ReactNode
  }

function MultiBadge({
  className,
  variant,
  label,
  children,
  ...props
}: MultiBadgeProps) {
  variant = 'multi'

  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      <div className="drop-shadow-sm">{label}</div>

      <span
        className={cn(
          'ml-1.5 pl-1.5 pr-2 leading-5 font-light bg-background text-foreground',
          'rounded-r-full',
        )}
      >
        {children}
      </span>
    </div>
  )
}

export { Badge, badgeVariants, MultiBadge }
