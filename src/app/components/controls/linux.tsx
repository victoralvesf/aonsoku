import { ComponentPropsWithoutRef } from 'react'
import { useAppWindow } from '@/app/hooks/use-app-window'
import { cn } from '@/lib/utils'
import { ControlButton } from './button'
import { Icons } from './icons'

type LinuxProps = ComponentPropsWithoutRef<'div'>

export function Linux({ className, ...props }: LinuxProps) {
  const { isWindowMaximized, minimizeWindow, maximizeWindow, closeWindow } =
    useAppWindow()

  return (
    <div
      className={cn('ml-1 mr-3 h-auto flex items-center gap-2', className)}
      {...props}
    >
      <ControlButton
        onClick={minimizeWindow}
        className="m-0 aspect-square size-[26px] cursor-default rounded-full p-0 hover:bg-foreground/10 active:bg-foreground/20"
      >
        <Icons.minimizeLinux className="text-foreground size-[13px] mt-[1px]" />
      </ControlButton>
      <ControlButton
        onClick={maximizeWindow}
        className="m-0 aspect-square size-[26px] cursor-default rounded-full p-0 hover:bg-foreground/10 active:bg-foreground/20"
      >
        {!isWindowMaximized ? (
          <Icons.maximizeLinux className="text-foreground size-3" />
        ) : (
          <Icons.maximizeRestoreLinux className="text-foreground size-3" />
        )}
      </ControlButton>
      <ControlButton
        onClick={closeWindow}
        className="m-0 aspect-square size-[26px] cursor-default rounded-full p-0 hover:bg-windows-red group active:bg-windows-red"
      >
        <Icons.closeLinux className="text-foreground group-hover:text-white size-3" />
      </ControlButton>
    </div>
  )
}
