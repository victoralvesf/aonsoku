import clsx from 'clsx'
import { NavigationButtons } from '@/app/components/header/navigation-buttons'
import { UserDropdown } from '@/app/components/header/user-dropdown'
import { HeaderSongInfo } from '@/app/components/header-song'
import { SettingsButton } from '@/app/components/settings/header-button'
import { useAppWindow } from '@/app/hooks/use-app-window'
import { isWindows, isLinux, isMacOS } from '@/utils/desktop'

export function Header() {
  const { isFullscreen } = useAppWindow()

  return (
    <header
      className={clsx(
        'w-full grid grid-cols-header h-header fixed px-4 top-0 right-0 left-0 z-20 bg-background border-b electron-drag',
        (isWindows || isLinux) && 'pr-[148px]',
      )}
    >
      <div className="flex items-center">
        {isMacOS && !isFullscreen && <div className="w-[70px]" />}
        <NavigationButtons />
      </div>
      <HeaderSongInfo />
      <div className="flex justify-end items-center gap-2">
        <SettingsButton />
        <UserDropdown />
      </div>
    </header>
  )
}
