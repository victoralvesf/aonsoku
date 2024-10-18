import { NavigationButtons } from '@/app/components/header/navigation-buttons'
import { UserDropdown } from '@/app/components/header/user-dropdown'
import { usePlayerSonglist } from '@/store/player.store'

export function Header() {
  const { currentList, currentSongIndex, currentSong } = usePlayerSonglist()

  const isPlaylistEmpty = currentList.length === 0

  function formatSongCount() {
    if (isPlaylistEmpty) return ''

    const currentPosition = currentSongIndex + 1
    const listLength = currentList.length

    return `[${currentPosition}/${listLength}]`
  }

  function getCurrentSongInfo() {
    if (isPlaylistEmpty) return ''

    return `${currentSong.artist} - ${currentSong.title}`
  }

  return (
    <header className="w-full grid grid-cols-header px-4 h-[--header-height] fixed top-0 right-0 left-0 z-20 bg-background border-b">
      <div className="flex items-center">
        <NavigationButtons />
      </div>
      <div className="col-span-2 flex justify-center items-center">
        <div className="flex w-full justify-center subpixel-antialiased font-medium text-sm text-muted-foreground">
          <p className="leading-7 mr-1">{formatSongCount()}</p>
          <p className="leading-7 truncate">{getCurrentSongInfo()}</p>
        </div>
      </div>
      <div className="flex justify-end items-center gap-2">
        <UserDropdown />
      </div>
    </header>
  )
}
