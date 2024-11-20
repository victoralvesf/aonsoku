import { Gnome } from '@/app/components/controls/gnome'
import { MacOS } from '@/app/components/controls/macos'
import { Windows } from '@/app/components/controls/windows'
import { NavigationButtons } from '@/app/components/header/navigation-buttons'
import { UserDropdown } from '@/app/components/header/user-dropdown'
import { HeaderSongInfo } from '@/app/components/header-song'
import { isLinux, isMac, isWindows } from '@/utils/osType'

export function Header() {
  return (
    <header className="w-full grid grid-cols-header px-4 h-[--header-height] fixed top-0 right-0 left-0 z-20 bg-background border-b">
      <div data-tauri-drag-region className="flex items-center">
        {isMac && (
          <div className="mr-2">
            <MacOS />
          </div>
        )}
        <NavigationButtons />
      </div>
      <HeaderSongInfo />
      <div
        data-tauri-drag-region
        className="flex justify-end items-center gap-2"
      >
        <UserDropdown />
        {isLinux && (
          <div className="flex items-center h-full">
            <Gnome />
          </div>
        )}
        {isWindows && (
          <div className="flex items-center h-full">
            <Windows />
          </div>
        )}
      </div>
    </header>
  )
}
