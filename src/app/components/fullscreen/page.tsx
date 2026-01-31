import { memo } from 'react'
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from '@/app/components/ui/drawer'
import { useAppWindow } from '@/app/hooks/use-app-window'
import { FullscreenBackdrop } from './backdrop'
import { FullscreenDragHandler } from './drag-handler'
import { FullscreenPlayer } from './player'
import { FullscreenTabs } from './tabs'

const MemoFullscreenBackdrop = memo(FullscreenBackdrop)

type FullscreenModeProps = {
  children: React.ReactNode
}

export function FullscreenMode({ children }: FullscreenModeProps) {
  const { handleFullscreen } = useAppWindow()

  return (
    <Drawer
      onAnimationEnd={handleFullscreen}
      fixed={true}
      handleOnly={true}
      disablePreventScroll={true}
      dismissible={true}
      modal={false}
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
          <div className="w-full max-h-[calc(100%-180px)] min-h-[calc(100%-180px)] px-8 2xl:px-16 pt-4 2xl:pt-8">
            <div className="min-h-[300px] h-full max-h-full">
              <FullscreenTabs />
            </div>
          </div>

          {/* Second Row */}
          <div className="h-[150px] min-h-[150px] px-8 2xl:px-16 py-2">
            <div className="flex items-center">
              <FullscreenPlayer />
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
