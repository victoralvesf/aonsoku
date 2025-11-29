import clsx from 'clsx'
import { Linux } from '@/app/components/controls/linux'
import { Windows } from '@/app/components/controls/windows'
import { NavigationButtons } from '@/app/components/header/navigation-buttons'
import { UserDropdown } from '@/app/components/header/user-dropdown'
import { HeaderSongInfo } from '@/app/components/header-song'
import { SettingsButton } from '@/app/components/settings/header-button'
import { useAppWindow } from '@/app/hooks/use-app-window'
import { isLinux, isMac, isWindows } from '@/utils/osType'
import { tauriDragRegion } from '@/utils/tauriDragRegion'

export function Header() {
  const { isFullscreen } = useAppWindow()

  return (
    <header
      className={clsx(
        'w-full grid grid-cols-header h-header px-4 fixed top-0 right-0 left-0 z-20 bg-background border-b',
        (isWindows || isLinux) && 'pr-0',
      )}
    >
      <div {...tauriDragRegion} className="flex items-center">
        {isMac && !isFullscreen && <div className="w-[70px]" />}
        <NavigationButtons />
      </div>
      <HeaderSongInfo />
      <div {...tauriDragRegion} className="flex justify-end items-center gap-2">
        <SettingsButton />
        <UserDropdown />
        {isWindows && <Windows />}
        {isLinux && <Linux />}
      </div>
    </header>
  )
}
