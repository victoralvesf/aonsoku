import { OptionsButtons } from '@/app/components/options/buttons'
import {
  DropdownMenuGroup,
  DropdownMenuSeparator,
} from '@/app/components/ui/dropdown-menu'
import { useOptions } from '@/app/hooks/use-options'
import { subsonic } from '@/service/subsonic'
import { usePlaylists } from '@/store/playlists.store'
import { Playlist, PlaylistWithEntries } from '@/types/responses/playlist'
import { ISong } from '@/types/responses/song'

interface PlaylistOptionsProps {
  playlist: PlaylistWithEntries | Playlist
  onRemovePlaylist: () => void
  disablePlayNext?: boolean
  disableAddLast?: boolean
  disableDownload?: boolean
  disableEdit?: boolean
  disableDelete?: boolean
}

export function PlaylistOptions({
  playlist,
  onRemovePlaylist,
  disablePlayNext = false,
  disableAddLast = false,
  disableDownload = false,
  disableEdit = false,
  disableDelete = false,
}: PlaylistOptionsProps) {
  const { setPlaylistDialogState, setData } = usePlaylists()
  const { playNext, playLast, startDownload } = useOptions()

  function handleEdit() {
    setData({
      id: playlist.id,
      name: playlist.name,
      comment: playlist.comment,
      public: playlist.public,
    })
    setPlaylistDialogState(true)
  }

  async function getSongsToQueue(callback: (songs: ISong[]) => void) {
    const playlistWithEntries = await subsonic.playlists.getOne(playlist.id)
    if (!playlistWithEntries) return

    callback(playlistWithEntries.entry)
  }

  async function handlePlayNext() {
    if ('entry' in playlist) {
      playNext(playlist.entry)
    } else {
      await getSongsToQueue(playNext)
    }
  }

  async function handlePlayLast() {
    if ('entry' in playlist) {
      playLast(playlist.entry)
    } else {
      await getSongsToQueue(playLast)
    }
  }

  function handleDownload() {
    startDownload(playlist.id)
  }

  return (
    <>
      <DropdownMenuGroup>
        <OptionsButtons.PlayNext
          disabled={disablePlayNext}
          onClick={handlePlayNext}
        />
        <OptionsButtons.PlayLast
          disabled={disableAddLast}
          onClick={handlePlayLast}
        />
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <OptionsButtons.Download
          disabled={disableDownload}
          onClick={handleDownload}
        />
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <OptionsButtons.EditPlaylist
          onClick={handleEdit}
          disabled={disableEdit}
        />
        <OptionsButtons.RemovePlaylist
          onClick={onRemovePlaylist}
          disabled={disableDelete}
        />
      </DropdownMenuGroup>
    </>
  )
}
