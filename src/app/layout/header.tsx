import { Fragment, useEffect, useState } from "react"
import { UnlistenFn, listen } from "@tauri-apps/api/event"

import { LogoutConfirmDialog } from "@/app/components/logout-confirm"
import { NavigationButtons } from "@/app/components/header/navigation-buttons"
import { ThemeToggle } from "@/app/components/header/theme-toggle"
import { usePlayer } from "@/app/contexts/player-context"
import { LangSelect } from "@/app/components/header/lang-select"
import { BrowserLogout } from "@/app/components/header/browser-logout"
import { isTauri } from "@/utils/tauriTools"

export function Header() {
  const [logoutDialogState, setLogoutDialogState] = useState(false)
  const player = usePlayer()

  useEffect(() => {
    let unlisten: UnlistenFn

    if (isTauri()) {
      const setupLogoutEventListener = async () => {
        unlisten = await listen('user-asked-for-logout', () => {
          setLogoutDialogState(true)
        });
      }
      setupLogoutEventListener()
    }

    return () => {
      if (unlisten) {
        unlisten()
      }
    }
  }, [])

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
      <LogoutConfirmDialog openDialog={logoutDialogState} setOpenDialog={setLogoutDialogState} />

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