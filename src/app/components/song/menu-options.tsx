import { OptionsButtons } from '@/app/components/options/buttons'
import { ContextMenuSeparator } from '@/app/components/ui/context-menu'
import { useOptions } from '@/app/hooks/use-options'
import { ISong } from '@/types/responses/song'
import { AddToPlaylistSubMenu } from './add-to-playlist'

interface SongMenuOptionsProps {
  variant: 'context' | 'dropdown'
  song: ISong
  index: number
}

export function SongMenuOptions({
  variant,
  song,
  index,
}: SongMenuOptionsProps) {
  const songOptions = useOptions()
  const songIndexes = [index.toString()]

  return (
    <>
      <OptionsButtons.PlayNext
        variant={variant}
        onClick={() => {
          songOptions.playNext([song])
        }}
      />
      <OptionsButtons.PlayLast
        variant={variant}
        onClick={() => {
          songOptions.playLast([song])
        }}
      />
      <ContextMenuSeparator />
      <OptionsButtons.AddToPlaylistOption variant={variant}>
        <AddToPlaylistSubMenu
          type={variant}
          newPlaylistFn={() =>
            songOptions.createNewPlaylist(song.title, song.id)
          }
          addToPlaylistFn={(id) => songOptions.addToPlaylist(id, song.id)}
        />
      </OptionsButtons.AddToPlaylistOption>
      {songOptions.isOnPlaylistPage && (
        <OptionsButtons.RemoveFromPlaylist
          variant={variant}
          onClick={() => songOptions.removeSongFromPlaylist(songIndexes)}
        />
      )}
      <ContextMenuSeparator />
      <OptionsButtons.Download
        variant={variant}
        onClick={() => {
          songOptions.startDownload(song.id)
        }}
      />
      <ContextMenuSeparator />
      <OptionsButtons.SongInfo
        variant={variant}
        onClick={() => songOptions.openSongInfo(song.id)}
      />
    </>
  )
}
