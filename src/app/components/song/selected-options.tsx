import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Table } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { useMatches } from 'react-router-dom'
import { getDownloadUrl } from '@/api/httpClient'
import { OptionsButtons } from '@/app/components/options/buttons'

import {
  ContextMenuItem,
  ContextMenuSeparator,
} from '@/app/components/ui/context-menu'
import { useDownload } from '@/app/hooks/use-download'
import { subsonic } from '@/service/subsonic'
import { usePlayerActions } from '@/store/player.store'
import { usePlaylistRemoveSong } from '@/store/playlists.store'
import { useSongInfo } from '@/store/ui.store'
import { ISong } from '@/types/responses/song'
import { queryKeys } from '@/utils/queryKeys'
import { isTauri } from '@/utils/tauriTools'
import { AddToPlaylistSubMenu } from './add-to-playlist'

interface SelectedSongsProps {
  table: Table<ISong>
}

export function SelectedSongsMenuOptions({ table }: SelectedSongsProps) {
  const { t } = useTranslation()
  const { setNextOnQueue, setLastOnQueue } = usePlayerActions()
  const { downloadBrowser, downloadTauri } = useDownload()
  const { setActionData, setConfirmDialogState } = usePlaylistRemoveSong()
  const matches = useMatches()
  const { setSongId, setModalOpen } = useSongInfo()

  const { rows } = table.getFilteredSelectedRowModel()
  const isSingleSelected = rows.length === 1
  const singleSong = isSingleSelected ? rows[0].original : undefined

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

  async function handleDownload() {
    if (!singleSong) return

    const url = getDownloadUrl(singleSong.id)
    if (isTauri()) {
      downloadTauri(url, singleSong.id)
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

  function handleSongInfoOption() {
    if (!singleSong) return

    setSongId(singleSong.id)
    setModalOpen(true)
  }

  return (
    <>
      <OptionsButtons.PlayNext
        variant="context"
        onClick={(e) => {
          e.stopPropagation()
          handlePlayNext()
        }}
      />
      <OptionsButtons.PlayLast
        variant="context"
        onClick={(e) => {
          e.stopPropagation()
          handlePlayLast()
        }}
      />
      <ContextMenuSeparator />
      <OptionsButtons.AddToPlaylistOption variant="context">
        <AddToPlaylistSubMenu
          type="context"
          newPlaylistFn={handleCreateNewPlaylist}
          addToPlaylistFn={handleAddToPlaylist}
        />
      </OptionsButtons.AddToPlaylistOption>
      {isOnPlaylistPage && (
        <OptionsButtons.RemoveFromPlaylist
          variant="context"
          onClick={(e) => {
            e.stopPropagation()
            handleRemoveSongsFromPlaylist()
          }}
        />
      )}
      {isSingleSelected && (
        <>
          <ContextMenuSeparator />
          <OptionsButtons.Download
            variant="context"
            onClick={(e) => {
              e.stopPropagation()
              handleDownload()
            }}
          />
          <ContextMenuSeparator />
          <OptionsButtons.SongInfo
            variant="context"
            onClick={handleSongInfoOption}
          />
        </>
      )}
      <ContextMenuSeparator />
      <ContextMenuItem disabled inset>
        {t('table.menu.selectedCount', { count: rows.length })}
      </ContextMenuItem>
    </>
  )
}
