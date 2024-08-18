import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import PlayButtons from '@/app/components/album/play-buttons'
import { PlaylistFallback } from '@/app/components/fallbacks/playlist-fallbacks'
import { PlaylistOptions } from '@/app/components/playlist/options'
import { PlaylistPageHeader } from '@/app/components/playlist/page-header'
import { RemovePlaylistDialog } from '@/app/components/playlist/remove-dialog'
import { DataTable } from '@/app/components/ui/data-table'
import ErrorPage from '@/app/pages/error-page'
import { songsColumns } from '@/app/tables/songs-columns'
import { subsonic } from '@/service/subsonic'
import { usePlayerActions } from '@/store/player.store'
import { ColumnFilter } from '@/types/columnFilter'
import { queryKeys } from '@/utils/queryKeys'

export default function Playlist() {
  const { playlistId } = useParams()
  const { t } = useTranslation()
  const columns = songsColumns()
  const [removeDialogState, setRemoveDialogState] = useState(false)
  const { setSongList } = usePlayerActions()

  const { data: playlist, isLoading } = useQuery({
    queryKey: [queryKeys.playlist.single, playlistId],
    queryFn: async () => await subsonic.playlists.getOne(playlistId!),
  })

  if (isLoading) return <PlaylistFallback />
  if (!playlist) return <ErrorPage status={404} statusText="Not Found" />

  const columnsToShow: ColumnFilter[] = [
    'index',
    'title',
    'artist',
    'album',
    'duration',
    'playCount',
    'contentType',
    'select',
  ]

  return (
    <div className="w-full px-8 py-6">
      <PlaylistPageHeader playlist={playlist} />

      <PlayButtons
        playButtonTooltip={t('playlist.buttons.play', {
          name: playlist.name,
        })}
        handlePlayButton={() => setSongList(playlist.entry, 0)}
        disablePlayButton={!playlist.entry}
        shuffleButtonTooltip={t('playlist.buttons.shuffle', {
          name: playlist.name,
        })}
        handleShuffleButton={() => setSongList(playlist.entry, 0, true)}
        disableShuffleButton={!playlist.entry}
        optionsTooltip={t('playlist.buttons.options', {
          name: playlist.name,
        })}
        showLikeButton={false}
        optionsMenuItems={
          <PlaylistOptions
            playlist={playlist}
            onRemovePlaylist={() => setRemoveDialogState(true)}
            disablePlayNext={!playlist.entry}
            disableAddLast={!playlist.entry}
            disableDownload={!playlist.entry}
          />
        }
      />

      <RemovePlaylistDialog
        playlistId={playlist.id}
        openDialog={removeDialogState}
        setOpenDialog={setRemoveDialogState}
      />

      <DataTable
        columns={columns}
        data={playlist.entry ?? []}
        handlePlaySong={(row) => setSongList(playlist.entry, row.index)}
        columnFilter={columnsToShow}
        noRowsMessage={t('playlist.noSongList')}
      />
    </div>
  )
}
