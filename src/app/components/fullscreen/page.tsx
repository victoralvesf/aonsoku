import { ReactNode } from 'react'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from '@/app/components/ui/drawer'
import FullscreenBackdrop from './backdrop'
import { CloseFullscreenButton, SwitchThemeButton } from './buttons'
import { FullscreenPlayer } from './player'
import { FullscreenTabs } from './tabs'

interface FullscreenModeProps {
  children: ReactNode
}

export default function FullscreenMode({ children }: FullscreenModeProps) {
  return (
    <Drawer
      fixed
      dismissible={true}
      handleOnly={true}
      disablePreventScroll={true}
    >
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent
        className="h-screen w-screen rounded-t-none border-none select-none cursor-default"
        showHandle={false}
      >
        <FullscreenBackdrop>
          <div className="flex flex-col p-8 w-screen h-screen gap-4">
            {/* First Row */}
            <div className="flex justify-between items-center w-full h-[40px]">
              <DrawerClose>
                <CloseFullscreenButton />
              </DrawerClose>

              <SwitchThemeButton />
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
        </FullscreenBackdrop>
      </DrawerContent>
    </Drawer>
  )
}
