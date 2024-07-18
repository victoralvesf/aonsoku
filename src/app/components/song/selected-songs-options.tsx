import { Row } from '@tanstack/react-table'
import { OptionsButtons } from '@/app/components/options/buttons'

import {
  DropdownMenuGroup,
  DropdownMenuSeparator,
} from '@/app/components/ui/dropdown-menu'
import { usePlayerActions } from '@/store/player.store'
import { usePlaylists } from '@/store/playlists.store'
import { ISong } from '@/types/responses/song'
import { AddToPlaylistSubMenu } from './add-to-playlist-sub-menu'

interface SelectedSongsProps {
  rows: Row<ISong>[]
}

export function SelectedSongsOptions({ rows }: SelectedSongsProps) {
  const { setNextOnQueue, setLastOnQueue } = usePlayerActions()
  const { editPlaylist, createPlaylist } = usePlaylists()

  async function handlePlayNext() {
    const songs = rows.map((row) => row.original)
    setNextOnQueue(songs)
  }

  async function handlePlayLast() {
    const songs = rows.map((row) => row.original)
    setLastOnQueue(songs)
  }

  async function handleAddToPlaylist(id: string) {
    const songs = rows.map((row) => row.original.id)

    await editPlaylist({
      playlistId: id,
      songIdToAdd: songs,
    })
  }

  async function handleCreateNewPlaylist() {
    const songsIds = rows.map((row) => row.original.id)
    const firstSong = rows[0].original

    await createPlaylist({
      name: firstSong.title,
      comment: '',
      isPublic: 'false',
      songIdToAdd: songsIds,
    })
  }

  return (
    <>
      <DropdownMenuGroup>
        <OptionsButtons.PlayNext
          onClick={(e) => {
            e.stopPropagation()
            handlePlayNext()
          }}
        />
        <OptionsButtons.PlayLast
          onClick={(e) => {
            e.stopPropagation()
            handlePlayLast()
          }}
        />
        <DropdownMenuSeparator />
        <OptionsButtons.AddToPlaylist>
          <AddToPlaylistSubMenu
            newPlaylistFn={handleCreateNewPlaylist}
            addToPlaylistFn={handleAddToPlaylist}
          />
        </OptionsButtons.AddToPlaylist>
      </DropdownMenuGroup>
    </>
  )
}
