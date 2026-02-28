import { ReactNode } from 'react'
import { ContextMenuSeparator } from '@/app/components/ui/context-menu'
import {
  DropdownMenuGroup,
  DropdownMenuSeparator,
} from '@/app/components/ui/dropdown-menu'

interface DownloadHandlerProps {
  children: ReactNode
  context?: boolean
  group?: boolean
}

export function DownloadOptionHandler({
  children,
  context = false,
  group = true,
}: DownloadHandlerProps) {
  const { DISABLE_DOWNLOADS } = window

  if (DISABLE_DOWNLOADS) {
    return null
  }

  if (context) {
    return (
      <>
        <ContextMenuSeparator />
        {children}
      </>
    )
  }

  return (
    <>
      <DropdownMenuSeparator />
      {group ? <DropdownMenuGroup>{children}</DropdownMenuGroup> : children}
    </>
  )
}
