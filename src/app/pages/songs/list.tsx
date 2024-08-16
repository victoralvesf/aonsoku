import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { ShadowHeader } from '@/app/components/album/shadow-header'
import { SongsListFallback } from '@/app/components/fallbacks/song-fallbacks'
import ListWrapper from '@/app/components/list-wrapper'
import { Badge } from '@/app/components/ui/badge'
import { DataTable } from '@/app/components/ui/data-table'
import { songsColumns } from '@/app/tables/songs-columns'
import { subsonic } from '@/service/subsonic'
import { usePlayerActions } from '@/store/player.store'
import { ColumnFilter } from '@/types/columnFilter'
import { ISong } from '@/types/responses/song'

export default function SongsList() {
  const { data: songlist, isLoading } = useQuery<ISong[]>({
    queryKey: ['get-all-songs'],
    queryFn: subsonic.songs.getAllSongs,
  })

  const { t } = useTranslation()
  const { setSongList } = usePlayerActions()

  const columns = songsColumns()

  const columnsToShow: ColumnFilter[] = [
    'index',
    'title',
    'artist',
    'album',
    'duration',
    'playCount',
    'played',
    'contentType',
    'select',
  ]

  function handlePlaySong(index: number) {
    if (songlist) setSongList(songlist, index)
  }

  if (isLoading) return <SongsListFallback />
  if (!songlist) return null

  return (
    <div className="w-full h-full">
      <ShadowHeader>
        <div className="flex gap-2 items-center">
          <h2 className="text-2xl font-semibold tracking-tight">
            {t('sidebar.songs')}
          </h2>
          <Badge variant="secondary" className="text-foreground/70">
            {songlist.length}
          </Badge>
        </div>
      </ShadowHeader>

      <ListWrapper className="pt-[--shadow-header-distance]">
        <DataTable
          columns={columns}
          data={songlist}
          showPagination={true}
          showSearch={true}
          searchColumn="title"
          handlePlaySong={(row) => handlePlaySong(row.index)}
          columnFilter={columnsToShow}
        />
      </ListWrapper>
    </div>
  )
}
