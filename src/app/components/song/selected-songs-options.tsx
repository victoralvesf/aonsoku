import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Table } from '@tanstack/react-table'
import { useMatches } from 'react-router-dom'
import { OptionsButtons } from '@/app/components/options/buttons'

import {
  DropdownMenuGroup,
  DropdownMenuSeparator,
} from '@/app/components/ui/dropdown-menu'
import { subsonic } from '@/service/subsonic'
import { usePlayerActions } from '@/store/player.store'
import { usePlaylistRemoveSong } from '@/store/playlists.store'
import { ISong } from '@/types/responses/song'
import { queryKeys } from '@/utils/queryKeys'
import { AddToPlaylistSubMenu } from './add-to-playlist-sub-menu'

interface SelectedSongsProps {
  table: Table<ISong>
}

export function SelectedSongsOptions({ table }: SelectedSongsProps) {
  const { setNextOnQueue, setLastOnQueue } = usePlayerActions()
  const { setActionData, setConfirmDialogState } = usePlaylistRemoveSong()
  const matches = useMatches()

  const { rows } = table.getFilteredSelectedRowModel()

  const isOnPlaylistPage = matches.find((route) => route.id === 'playlist')
  const playlistId = isOnPlaylistPage?.params.playlistId ?? ''

  async function handlePlayNext() {
    const songs = rows.map((row) => row.original)
    setNextOnQueue(songs)
    table.resetRowSelection()
  }

  async function handlePlayLast() {
    const songs = rows.map((row) => row.original)
    setLastOnQueue(songs)
    table.resetRowSelection()
  }

  const queryClient = useQueryClient()

  const updateMutation = useMutation({
    mutationFn: subsonic.playlists.update,
    onSuccess: () => {
      if (isOnPlaylistPage) {
        queryClient.invalidateQueries({
          queryKey: [queryKeys.playlist.single, playlistId],
        })
      }
    },
  })

  async function handleAddToPlaylist(id: string) {
    const songs = rows.map((row) => row.original.id)

    await updateMutation.mutateAsync({
      playlistId: id,
      songIdToAdd: songs,
    })
    table.resetRowSelection()
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
    table.resetRowSelection()
  }

  function handleRemoveSongsFromPlaylist() {
    const songIndexes = rows.map((row) => row.index.toString())

    setActionData({
      playlistId,
      songIndexes,
    })
    setConfirmDialogState(true)
    table.resetRowSelection()
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
        {isOnPlaylistPage && (
          <OptionsButtons.RemoveFromPlaylist
            onClick={(e) => {
              e.stopPropagation()
              handleRemoveSongsFromPlaylist()
            }}
          />
        )}
      </DropdownMenuGroup>
    </>
  )
}
