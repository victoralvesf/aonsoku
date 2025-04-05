import { usePlayerSonglist } from '@/store/player.store'
import { tauriDragRegion } from '@/utils/tauriDragRegion'
import { AppTitle } from './header/app-title'

export function HeaderSongInfo() {
  const { currentList, currentSongIndex, currentSong } = usePlayerSonglist()

  const isPlaylistEmpty = currentList.length === 0

  function formatSongCount() {
    const currentPosition = currentSongIndex + 1
    const listLength = currentList.length

    return `[${currentPosition}/${listLength}]`
  }

  function getCurrentSongInfo() {
    return `${currentSong.artist} - ${currentSong.title}`
  }

  return (
    <div
      {...tauriDragRegion}
      className="col-span-2 flex justify-center items-center"
    >
      {isPlaylistEmpty && <AppTitle />}
      {!isPlaylistEmpty && (
        <div
          {...tauriDragRegion}
          className="flex w-full justify-center subpixel-antialiased font-medium text-sm text-muted-foreground"
        >
          <p {...tauriDragRegion} className="leading-7 mr-1">
            {formatSongCount()}
          </p>
          <p {...tauriDragRegion} className="leading-7 truncate">
            {getCurrentSongInfo()}
          </p>
        </div>
      )}
    </div>
  )
}
