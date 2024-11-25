import clsx from 'clsx'
import { useEffect, useState, type HTMLProps } from 'react'
import { useAppWindow } from '@/app/hooks/use-app-window'
import { cn } from '@/lib/utils'
import { ControlButton } from './button'
import { Icons } from './icons'

export function MacOS({ className, ...props }: HTMLProps<HTMLDivElement>) {
  const { minimizeWindow, maximizeWindow, toggleFullscreen, closeWindow } =
    useAppWindow()

  const [isAltKeyPressed, setIsAltKeyPressed] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const handleKeyChange = (e: KeyboardEvent) => {
      if ((e.altKey || e.metaKey) !== isAltKeyPressed) {
        setIsAltKeyPressed(e.altKey)
      }
    }

    window.addEventListener('keydown', handleKeyChange)
    window.addEventListener('keyup', handleKeyChange)

    return () => {
      window.removeEventListener('keydown', handleKeyChange)
      window.removeEventListener('keyup', handleKeyChange)
    }
  }, [isAltKeyPressed])

  return (
    <div
      className={cn(
        'space-x-2 px-3 text-black active:text-black dark:text-black',
        className,
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      {...props}
    >
      <ControlButton
        onClick={closeWindow}
        className="relative aspect-square h-3 w-3 cursor-default content-center items-center justify-center self-center rounded-full border border-black/[.12] bg-[#ff544d] text-center text-black/60 hover:bg-[#ff544d] active:bg-[#bf403a] active:text-black/60 dark:border-none"
      >
        <Icons.closeMac
          className={clsx(
            'absolute transition-opacity',
            isHovering ? 'block' : 'hidden',
          )}
        />
      </ControlButton>
      <ControlButton
        onClick={minimizeWindow}
        className="relative aspect-square h-3 w-3 cursor-default content-center items-center justify-center self-center rounded-full border border-black/[.12]  bg-[#ffbd2e] text-center text-black/60 hover:bg-[#ffbd2e] active:bg-[#bf9122] active:text-black/60 dark:border-none"
      >
        <Icons.minMac
          className={clsx(
            'absolute transition-opacity',
            isHovering ? 'block' : 'hidden',
          )}
        />
      </ControlButton>
      <ControlButton
        onClick={isAltKeyPressed ? maximizeWindow : toggleFullscreen}
        className="relative aspect-square h-3 w-3 cursor-default content-center items-center justify-center self-center rounded-full border border-black/[.12] bg-[#28c93f] text-center text-black/60 hover:bg-[#28c93f] active:bg-[#1e9930] active:text-black/60 dark:border-none"
      >
        <Icons.fullMac
          className={clsx(
            'absolute transition-opacity',
            isHovering && !isAltKeyPressed ? 'opacity-100' : 'opacity-0',
          )}
        />
        <Icons.plusMac
          className={clsx(
            'absolute transition-opacity',
            isHovering && isAltKeyPressed ? 'opacity-100' : 'opacity-0',
          )}
        />
      </ControlButton>
    </div>
  )
}
