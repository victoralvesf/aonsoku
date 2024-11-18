import * as CollapsiblePrimitive from '@radix-ui/react-collapsible'
import { ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/utils'

const Collapsible = CollapsiblePrimitive.Root

const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger

type ContentProps = ComponentPropsWithoutRef<
  typeof CollapsiblePrimitive.CollapsibleContent
>

const CollapsibleContent = ({
  className,
  children,
  ...props
}: ContentProps) => (
  <CollapsiblePrimitive.CollapsibleContent
    className={cn(
      'overflow-hidden data-[state=closed]:animate-slide-up data-[state=open]:animate-slide-down',
      className,
    )}
    {...props}
  >
    {children}
  </CollapsiblePrimitive.CollapsibleContent>
)

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
