import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMatches } from 'react-router-dom'
import { getDownloadUrl } from '@/api/httpClient'
import { OptionsButtons } from '@/app/components/options/buttons'
import { AddToPlaylistSubMenu } from '@/app/components/song/add-to-playlist-sub-menu'
import {
  DropdownMenuGroup,
  DropdownMenuSeparator,
} from '@/app/components/ui/dropdown-menu'
import { useDownload } from '@/app/hooks/use-download'
import { subsonic } from '@/service/subsonic'
import { usePlayerActions } from '@/store/player.store'
import { usePlaylistRemoveSong } from '@/store/playlists.store'
import { ISong } from '@/types/responses/song'
import { queryKeys } from '@/utils/queryKeys'
import { isTauri } from '@/utils/tauriTools'

interface SongOptionsProps {
  song: ISong
  index: number
}

export function SongOptions({ song, index }: SongOptionsProps) {
  const { setNextOnQueue, setLastOnQueue } = usePlayerActions()
  const { downloadBrowser, downloadTauri } = useDownload()
  const { setActionData, setConfirmDialogState } = usePlaylistRemoveSong()
  const matches = useMatches()

  const isOnPlaylistPage = matches.find((route) => route.id === 'playlist')
  const playlistId = isOnPlaylistPage?.params.playlistId ?? ''

  async function handlePlayNext() {
    setNextOnQueue([song])
  }

  async function handlePlayLast() {
    setLastOnQueue([song])
  }

  async function handleDownload() {
    const url = getDownloadUrl(song.id)
    if (isTauri()) {
      downloadTauri(url, song.id)
    } else {
      downloadBrowser(url)
    }
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
    await updateMutation.mutateAsync({
      playlistId: id,
      songIdToAdd: song.id,
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
    await createMutation.mutateAsync({
      name: song.title,
      comment: '',
      isPublic: 'false',
      songIdToAdd: song.id,
    })
  }

  function handleRemoveSongFromPlaylist() {
    setActionData({
      playlistId,
      songIndexes: [index.toString()],
    })
    setConfirmDialogState(true)
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
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <OptionsButtons.AddToPlaylist>
        <AddToPlaylistSubMenu
          newPlaylistFn={handleCreateNewPlaylist}
          addToPlaylistFn={handleAddToPlaylist}
        />
      </OptionsButtons.AddToPlaylist>
      {isOnPlaylistPage && (
        <OptionsButtons.RemoveFromPlaylist
          onClick={handleRemoveSongFromPlaylist}
        />
      )}
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <OptionsButtons.Download
          onClick={(e) => {
            e.stopPropagation()
            handleDownload()
          }}
        />
      </DropdownMenuGroup>
    </>
  )
}
