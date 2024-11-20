import { type HTMLProps } from 'react'
import { useAppWindow } from '@/app/hooks/use-app-window'
import { cn } from '@/lib/utils'
import { ControlButton } from './button'
import { Icons } from './icons'

export function Windows({ className, ...props }: HTMLProps<HTMLDivElement>) {
  const { minimizeWindow, maximizeWindow, closeWindow, isWindowMaximized } =
    useAppWindow()

  return (
    <div className={cn('h-8', className)} {...props}>
      <ControlButton
        onClick={minimizeWindow}
        className={cn(
          'h-8 max-h-8 w-[46px] cursor-default rounded-none bg-transparent',
          'text-black/90 hover:bg-black/[.08] active:bg-black/[.06]  dark:text-white dark:hover:bg-white/[.10] dark:active:bg-white/[.08]',
        )}
      >
        <Icons.minimizeWin />
      </ControlButton>
      <ControlButton
        onClick={maximizeWindow}
        className={cn(
          'h-8 max-h-8 w-[46px] cursor-default rounded-none bg-transparent',
          'text-black/90 hover:bg-black/[.08] active:bg-black/[.06]  dark:text-white dark:hover:bg-white/[.10] dark:active:bg-white/[.08]',
        )}
      >
        {!isWindowMaximized ? (
          <Icons.maximizeWin />
        ) : (
          <Icons.maximizeRestoreWin />
        )}
      </ControlButton>
      <ControlButton
        onClick={closeWindow}
        className="h-8 max-h-8 w-[46px] cursor-default rounded-none bg-transparent text-black/90 hover:bg-[#c42b1c] hover:text-white active:bg-[#c42b1c]/90 dark:text-white"
      >
        <Icons.closeWin />
      </ControlButton>
    </div>
  )
}
