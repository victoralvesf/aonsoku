import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMatches } from 'react-router-dom'
import { getDownloadUrl } from '@/api/httpClient'
import { OptionsButtons } from '@/app/components/options/buttons'
import { ContextMenuSeparator } from '@/app/components/ui/context-menu'
import { useDownload } from '@/app/hooks/use-download'
import { subsonic } from '@/service/subsonic'
import { usePlayerActions } from '@/store/player.store'
import { usePlaylistRemoveSong } from '@/store/playlists.store'
import { useSongInfo } from '@/store/ui.store'
import { ISong } from '@/types/responses/song'
import { queryKeys } from '@/utils/queryKeys'
import { isTauri } from '@/utils/tauriTools'
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
  const { setNextOnQueue, setLastOnQueue } = usePlayerActions()
  const { downloadBrowser, downloadTauri } = useDownload()
  const { setActionData, setConfirmDialogState } = usePlaylistRemoveSong()
  const matches = useMatches()
  const { setSongId, setModalOpen } = useSongInfo()

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

  function handleSongInfoOption() {
    setSongId(song.id)
    setModalOpen(true)
  }

  return (
    <>
      <OptionsButtons.PlayNext
        variant={variant}
        onClick={(e) => {
          e.stopPropagation()
          handlePlayNext()
        }}
      />
      <OptionsButtons.PlayLast
        variant={variant}
        onClick={(e) => {
          e.stopPropagation()
          handlePlayLast()
        }}
      />
      <ContextMenuSeparator />
      <OptionsButtons.AddToPlaylistOption variant={variant}>
        <AddToPlaylistSubMenu
          type={variant}
          newPlaylistFn={handleCreateNewPlaylist}
          addToPlaylistFn={handleAddToPlaylist}
        />
      </OptionsButtons.AddToPlaylistOption>
      {isOnPlaylistPage && (
        <OptionsButtons.RemoveFromPlaylist
          variant={variant}
          onClick={handleRemoveSongFromPlaylist}
        />
      )}
      <ContextMenuSeparator />
      <OptionsButtons.Download
        variant={variant}
        onClick={(e) => {
          e.stopPropagation()
          handleDownload()
        }}
      />
      <ContextMenuSeparator />
      <OptionsButtons.SongInfo
        variant={variant}
        onClick={handleSongInfoOption}
      />
    </>
  )
}
