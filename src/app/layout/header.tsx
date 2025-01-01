import { Windows } from '@/app/components/controls/windows'
import { NavigationButtons } from '@/app/components/header/navigation-buttons'
import { UserDropdown } from '@/app/components/header/user-dropdown'
import { HeaderSongInfo } from '@/app/components/header-song'
import { useAppWindow } from '@/app/hooks/use-app-window'
import { isMac, isWindows } from '@/utils/osType'
import { tauriDragRegion } from '@/utils/tauriDragRegion'

export function Header() {
  const { isFullscreen } = useAppWindow()

  return (
    <header className="w-full grid grid-cols-header px-1 h-[--header-height] fixed top-0 right-0 left-0 z-20 bg-background border-b">
      <div {...tauriDragRegion} className="flex items-center">
        {isMac && !isFullscreen && <div className="w-[70px]" />}
        <NavigationButtons />
      </div>
      <HeaderSongInfo />
      <div {...tauriDragRegion} className="flex justify-end items-center gap-2">
        <UserDropdown />
        {isWindows && <Windows />}
      </div>
    </header>
  )
}
