import { NavigationButtons } from '@/app/components/header/navigation-buttons'
import { UserDropdown } from '@/app/components/header/user-dropdown'
import { WindowControlsSpacer } from '@/app/components/header/window-controls-spacer'
import { HeaderSongInfo } from '@/app/components/header-song'
import { SettingsButton } from '@/app/components/settings/header-button'
import { MainSidebarTrigger } from '@/app/components/ui/main-sidebar'
import { useAppWindow } from '@/app/hooks/use-app-window'
import { isLinux, isMacOS, isWindows } from '@/utils/desktop'

export function Header() {
  const { isFullscreen } = useAppWindow()

  return (
    <header className="w-full grid grid-cols-header h-header px-4 fixed top-0 right-0 left-0 z-20 bg-background border-b electron-drag">
      <div className="flex items-center">
        {isMacOS && !isFullscreen && <WindowControlsSpacer width={70} />}
        <NavigationButtons />
        <MainSidebarTrigger className="ml-2" />
      </div>
      <HeaderSongInfo />
      <div className="flex justify-end items-center gap-2">
        <SettingsButton />
        <UserDropdown />
        {isWindows && !isFullscreen && <WindowControlsSpacer width={122} />}
        {isLinux && !isFullscreen && <div className="w-[94px] shrink-0" />}
      </div>
    </header>
  )
}
