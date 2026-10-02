import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useMatches } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getDownloadUrl } from '@/api/httpClient'
import { subsonic } from '@/service/subsonic'
import { usePlayerActions } from '@/store/player.store'
import { usePlaylistRemoveSong } from '@/store/playlists.store'
import { useSongInfo } from '@/store/ui.store'
import { PlaybackSource } from '@/types/playerContext'
import { UpdateParams } from '@/types/responses/playlist'
import { ISong } from '@/types/responses/song'
import { isDesktop } from '@/utils/desktop'
import { queryKeys } from '@/utils/queryKeys'
import { useDownload } from './use-download'

type SongIdToAdd = Pick<UpdateParams, 'songIdToAdd'>['songIdToAdd']

export function useOptions() {
  const { t } = useTranslation()
  const { setNextOnQueue, setLastOnQueue, setSongList } = usePlayerActions()
  const { downloadBrowser, downloadDesktop } = useDownload()
  const { setActionData, setConfirmDialogState } = usePlaylistRemoveSong()
  const matches = useMatches()
  const { setSongId, setModalOpen } = useSongInfo()

  const isOnPlaylistPage = matches.find((route) => route.id === 'playlist')
  const playlistId = isOnPlaylistPage?.params.playlistId ?? ''

  const queryClient = useQueryClient()

  function play(list: ISong[], source?: PlaybackSource) {
    setSongList(list, 0, false, source)
  }

  function playNext(list: ISong[]) {
    setNextOnQueue(list)
  }

  function playLast(list: ISong[]) {
    setLastOnQueue(list)
  }

  // The id may be a song's or an album's. A song seed plays first.
  async function playRadio(id: string, seed?: ISong) {
    const similarSongs = await subsonic.songs.getSimilarSongs(id)
    const mix = similarSongs.filter((song) => song.id !== seed?.id)

    if (mix.length === 0) {
      toast.error(t('artist.radio.empty'))
      return
    }

    setSongList(seed ? [seed, ...mix] : mix, 0)
  }

  function startDownload(id: string) {
    const url = getDownloadUrl(id)

    if (isDesktop()) {
      downloadDesktop(url, id)
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
    playRadio,
    startDownload,
    addToPlaylist,
    createNewPlaylist,
    removeSongFromPlaylist,
    openSongInfo,
    isOnPlaylistPage,
    playlistId,
  }
}
