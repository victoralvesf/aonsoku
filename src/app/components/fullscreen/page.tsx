import { memo, ReactNode, useEffect } from 'react'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from '@/app/components/ui/drawer'
import { useAppWindow } from '@/app/hooks/use-app-window'
import { useFullscreenPlayerSettings } from '@/store/player.store'
import { enterFullscreen, exitFullscreen } from '@/utils/browser'
import { isDesktop } from '@/utils/desktop'
import { setDesktopTitleBarColors } from '@/utils/theme'
import { FullscreenBackdrop } from './backdrop'
import { CloseFullscreenButton } from './buttons'
import { FullscreenDragHandler } from './drag-handler'
import { FullscreenPlayer } from './player'
import { FullscreenSettings } from './settings'
import { FullscreenTabs } from './tabs'

interface FullscreenModeProps {
  children: ReactNode
}

const MemoFullscreenBackdrop = memo(FullscreenBackdrop)

export default function FullscreenMode({ children }: FullscreenModeProps) {
  const { enterFullscreenWindow, exitFullscreenWindow } = useAppWindow()
  const { autoFullscreenEnabled } = useFullscreenPlayerSettings()

  // biome-ignore lint/correctness/useExhaustiveDependencies: initial useEffect
  useEffect(() => {
    return () => {
      if (isDesktop()) {
        exitFullscreenWindow().then(() => {
          setDesktopTitleBarColors(false)
        })
      } else {
        exitFullscreen()
      }
    }
  }, [])

  async function handleFullscreen(open: boolean) {
    // We set title bar colors to transparent,
    // to not "unstyle" the big player appearance
    if (isDesktop()) setDesktopTitleBarColors(open)

    if (!autoFullscreenEnabled) return

    if (isDesktop()) {
      open ? await enterFullscreenWindow() : await exitFullscreenWindow()
      return
    }

    open ? enterFullscreen() : exitFullscreen()
  }

  return (
    <Drawer
      fixed
      dismissible={true}
      handleOnly={true}
      disablePreventScroll={true}
      modal={false}
      onOpenChange={handleFullscreen}
    >
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerTitle className="sr-only">Big Player</DrawerTitle>
      <DrawerContent
        className="h-screen w-screen rounded-t-none border-none select-none cursor-default mt-0"
        showHandle={false}
        aria-describedby={undefined}
      >
        <MemoFullscreenBackdrop />
        <FullscreenDragHandler />
        <div className="absolute inset-0 flex flex-col p-0 2xl:p-8 pt-10 2xl:pt-12 w-full h-full gap-4 bg-black/0 z-10">
          {/* First Row */}
          <div className="flex gap-2 items-center w-full h-[40px] px-16 z-20 justify-end">
            <FullscreenSettings />
            <DrawerClose>
              <CloseFullscreenButton />
            </DrawerClose>
          </div>

          {/* Second Row */}
          <div className="w-full max-h-[calc(100%-220px)] min-h-[calc(100%-220px)] px-16">
            <div className="min-h-[300px] h-full max-h-full">
              <FullscreenTabs />
            </div>
          </div>

          {/* Third Row */}
          <div className="h-[150px] min-h-[150px] px-16 py-2">
            <div className="flex items-center">
              <FullscreenPlayer />
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
