import clsx from 'clsx'
import { memo, ReactNode } from 'react'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from '@/app/components/ui/drawer'
import { useAppWindow } from '@/app/hooks/use-app-window'
import { useFullscreenPlayerSettings } from '@/store/player.store'
import { enterFullscreen, exitFullscreen } from '@/utils/browser'
import { isWindows } from '@/utils/osType'
import { isTauri } from '@/utils/tauriTools'
import { FullscreenBackdrop } from './backdrop'
import { CloseFullscreenButton } from './buttons'
import { DragRegion } from './drag-region'
import { FullscreenPlayer } from './player'
import { FullscreenTabs } from './tabs'

interface FullscreenModeProps {
  children: ReactNode
}

const MemoFullscreenBackdrop = memo(FullscreenBackdrop)

export default function FullscreenMode({ children }: FullscreenModeProps) {
  const { enterFullscreenWindow, exitFullscreenWindow } = useAppWindow()
  const { autoFullscreenEnabled } = useFullscreenPlayerSettings()

  function handleFullscreen(open: boolean) {
    if (!autoFullscreenEnabled) return

    if (isTauri()) {
      // flag to prevent enter fullscreen on windows
      // because it's not fully supported by tauri
      if (isWindows) return
      open ? enterFullscreenWindow() : exitFullscreenWindow()
    } else {
      open ? enterFullscreen() : exitFullscreen()
    }
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
      <DrawerContent
        className="h-screen w-screen rounded-t-none border-none select-none cursor-default mt-0"
        showHandle={false}
      >
        <MemoFullscreenBackdrop />
        <div className="absolute inset-0 flex flex-col p-8 w-full h-full gap-4 bg-black/0 z-10">
          {isTauri() && <DragRegion className="z-10" />}

          {/* First Row */}
          <div
            className={clsx(
              'flex gap-2 items-center w-full h-[40px] px-16 z-20',
              isWindows ? 'justify-start' : 'justify-end',
            )}
          >
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
