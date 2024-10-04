import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { PlaylistFallback } from '@/app/components/fallbacks/playlist-fallbacks'
import { PlaylistButtons } from '@/app/components/playlist/buttons'
import { PlaylistPageHeader } from '@/app/components/playlist/page-header'
import { RemoveSongFromPlaylistDialog } from '@/app/components/playlist/remove-song-dialog'
import { DataTable } from '@/app/components/ui/data-table'
import ErrorPage from '@/app/pages/error-page'
import { songsColumns } from '@/app/tables/songs-columns'
import { subsonic } from '@/service/subsonic'
import { usePlayerActions } from '@/store/player.store'
import { ColumnFilter } from '@/types/columnFilter'
import { queryKeys } from '@/utils/queryKeys'

export default function Playlist() {
  const { playlistId } = useParams() as { playlistId: string }
  const { t } = useTranslation()
  const columns = songsColumns()
  const { setSongList } = usePlayerActions()

  const { data: playlist, isLoading } = useQuery({
    queryKey: [queryKeys.playlist.single, playlistId],
    queryFn: () => subsonic.playlists.getOne(playlistId),
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

      <PlaylistButtons playlist={playlist} />

      <DataTable
        columns={columns}
        data={playlist.entry ?? []}
        handlePlaySong={(row) => setSongList(playlist.entry, row.index)}
        columnFilter={columnsToShow}
        noRowsMessage={t('playlist.noSongList')}
        variant="modern"
      />

      <RemoveSongFromPlaylistDialog />
    </div>
  )
}
