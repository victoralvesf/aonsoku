import { Fragment, useState } from 'react'

import { BrowserLogout } from '@/app/components/header/browser-logout'
import { LangSelect } from '@/app/components/header/lang-select'
import { NavigationButtons } from '@/app/components/header/navigation-buttons'
import { ThemeToggle } from '@/app/components/header/theme-toggle'
import { LogoutConfirmDialog } from '@/app/components/logout-confirm'
import { usePlayer } from '@/app/contexts/player-context'

export function Header() {
  const [logoutDialogState, setLogoutDialogState] = useState(false)
  const player = usePlayer()

  const isPlaylistEmpty = player.currentSongList.length === 0

  function formatSongCount() {
    if (isPlaylistEmpty) return ''

    const currentPosition = player.currentSongIndex + 1
    const listLength = player.currentSongList.length

    return `[${currentPosition}/${listLength}]`
  }

  function getCurrentSongInfo() {
    if (isPlaylistEmpty) return ''

    const song = player.getCurrentSong()

    return `${song.artist} - ${song.title}`
  }

  return (
    <Fragment>
      <LogoutConfirmDialog
        openDialog={logoutDialogState}
        setOpenDialog={setLogoutDialogState}
      />

      <div className="w-full grid grid-cols-header h-[40px] px-4">
        <div className="flex items-center">
          <NavigationButtons />
        </div>
        <div className="col-span-2 flex justify-center items-center">
          <div className="flex w-full justify-center subpixel-antialiased font-medium text-sm text-foreground/80">
            <p className="leading-7 mr-1">{formatSongCount()}</p>
            <p className="leading-7 truncate">{getCurrentSongInfo()}</p>
          </div>
        </div>
        <div className="flex justify-end items-center gap-2 pr-4">
          <LangSelect />
          <ThemeToggle />
          <BrowserLogout openDialog={setLogoutDialogState} />
        </div>
      </div>
    </Fragment>
  )
}
