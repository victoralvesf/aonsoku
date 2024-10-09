import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMatches } from 'react-router-dom'
import { getDownloadUrl } from '@/api/httpClient'
import { subsonic } from '@/service/subsonic'
import { usePlayerActions } from '@/store/player.store'
import { usePlaylistRemoveSong } from '@/store/playlists.store'
import { useSongInfo } from '@/store/ui.store'
import { UpdateParams } from '@/types/responses/playlist'
import { ISong } from '@/types/responses/song'
import { queryKeys } from '@/utils/queryKeys'
import { isTauri } from '@/utils/tauriTools'
import { useDownload } from './use-download'

type SongIdToAdd = Pick<UpdateParams, 'songIdToAdd'>['songIdToAdd']

export function useOptions() {
  const { setNextOnQueue, setLastOnQueue, setSongList } = usePlayerActions()
  const { downloadBrowser, downloadTauri } = useDownload()
  const { setActionData, setConfirmDialogState } = usePlaylistRemoveSong()
  const matches = useMatches()
  const { setSongId, setModalOpen } = useSongInfo()

  const isOnPlaylistPage = matches.find((route) => route.id === 'playlist')
  const playlistId = isOnPlaylistPage?.params.playlistId ?? ''

  const queryClient = useQueryClient()

  function play(list: ISong[]) {
    setSongList(list, 0)
  }

  function playNext(list: ISong[]) {
    setNextOnQueue(list)
  }

  function playLast(list: ISong[]) {
    setLastOnQueue(list)
  }

  function startDownload(id: string) {
    const url = getDownloadUrl(id)
    if (isTauri()) {
      downloadTauri(url, id)
    } else {
      downloadBrowser(url)
    }
  }

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

  async function addToPlaylist(id: string, songIdToAdd: SongIdToAdd) {
    await updateMutation.mutateAsync({
      playlistId: id,
      songIdToAdd,
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

  async function createNewPlaylist(name: string, songIdToAdd: SongIdToAdd) {
    await createMutation.mutateAsync({
      name,
      comment: '',
      isPublic: 'false',
      songIdToAdd,
    })
  }

  function removeSongFromPlaylist(songIndexes: string[]) {
    setActionData({
      playlistId,
      songIndexes,
    })
    setConfirmDialogState(true)
  }

  function openSongInfo(id: string) {
    setSongId(id)
    setModalOpen(true)
  }

  return {
    play,
    playNext,
    playLast,
    startDownload,
    addToPlaylist,
    createNewPlaylist,
    removeSongFromPlaylist,
    openSongInfo,
    isOnPlaylistPage,
    playlistId,
  }
}
