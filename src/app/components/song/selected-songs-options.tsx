import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Row } from '@tanstack/react-table'
import { OptionsButtons } from '@/app/components/options/buttons'

import {
  DropdownMenuGroup,
  DropdownMenuSeparator,
} from '@/app/components/ui/dropdown-menu'
import { subsonic } from '@/service/subsonic'
import { usePlayerActions } from '@/store/player.store'
import { ISong } from '@/types/responses/song'
import { queryKeys } from '@/utils/queryKeys'
import { AddToPlaylistSubMenu } from './add-to-playlist-sub-menu'

interface SelectedSongsProps {
  rows: Row<ISong>[]
}

export function SelectedSongsOptions({ rows }: SelectedSongsProps) {
  const { setNextOnQueue, setLastOnQueue } = usePlayerActions()

  async function handlePlayNext() {
    const songs = rows.map((row) => row.original)
    setNextOnQueue(songs)
  }

  async function handlePlayLast() {
    const songs = rows.map((row) => row.original)
    setLastOnQueue(songs)
  }

  const queryClient = useQueryClient()

  const updateMutation = useMutation({
    mutationFn: subsonic.playlists.update,
  })

  async function handleAddToPlaylist(id: string) {
    const songs = rows.map((row) => row.original.id)

    await updateMutation.mutateAsync({
      playlistId: id,
      songIdToAdd: songs,
    })
  }

  const createMutation = useMutation({
    mutationFn: subsonic.playlists.createWithDetails,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.playlist.all],
      })
    },
  })

  async function handleCreateNewPlaylist() {
    const songsIds = rows.map((row) => row.original.id)
    const firstSong = rows[0].original

    await createMutation.mutateAsync({
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
