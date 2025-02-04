import clsx from 'clsx'
import { type HTMLProps } from 'react'
import { useAppWindow } from '@/app/hooks/use-app-window'
import { cn } from '@/lib/utils'
import { useMinimizeToSystemTraySettings } from '@/store/player.store'
import { ControlButton } from './button'
import { Icons } from './icons'

const regularButton = clsx(
  'h-8 max-h-8 w-[46px] cursor-default rounded-none bg-transparent',
  'text-foreground hover:bg-muted active:bg-muted',
)

export function Windows({ className, ...props }: HTMLProps<HTMLDivElement>) {
  const {
    minimizeWindow,
    maximizeWindow,
    closeWindow,
    isWindowMaximized,
    hideWindow,
  } = useAppWindow()

  const { minimizeToSystemTrayEnabled } = useMinimizeToSystemTraySettings()

  function handleMinimizeWindow() {
    if (minimizeToSystemTrayEnabled) {
      hideWindow()
    } else {
      minimizeWindow()
    }
  }

  return (
    <div className={cn('h-8', className)} {...props}>
      <ControlButton onClick={handleMinimizeWindow} className={regularButton}>
        <Icons.minimizeWin />
      </ControlButton>
      <ControlButton onClick={maximizeWindow} className={regularButton}>
        {!isWindowMaximized ? (
          <Icons.maximizeWin />
        ) : (
          <Icons.maximizeRestoreWin />
        )}
      </ControlButton>
      <ControlButton
        onClick={closeWindow}
        className={clsx(
          regularButton,
          'hover:bg-windows-red hover:text-white active:bg-windows-red/90',
        )}
      >
        <Icons.closeWin />
      </ControlButton>
    </div>
  )
}
