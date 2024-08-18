import { useTranslation } from 'react-i18next'
import { DataTable } from '@/app/components/ui/data-table'
import { songsColumns } from '@/app/tables/songs-columns'
import { usePlayerActions } from '@/store/player.store'
import { ColumnFilter } from '@/types/columnFilter'
import { ISong } from '@/types/responses/song'

export default function ArtistTopSongs({ topSongs }: { topSongs: ISong[] }) {
  const columns = songsColumns()
  const topTenSongs = topSongs.length > 10 ? topSongs.slice(0, 10) : topSongs

  const { setSongList } = usePlayerActions()
  const { t } = useTranslation()

  const columnsToShow: ColumnFilter[] = [
    'index',
    'title',
    'album',
    'year',
    'duration',
    'playCount',
    'played',
    'contentType',
    'select',
  ]

  return (
    <div className="w-full mb-4">
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-4 mt-6">
        {t('artist.topSongs')}
      </h3>

      <DataTable
        columns={columns}
        data={topTenSongs}
        handlePlaySong={(row) => setSongList(topTenSongs, row.index)}
        columnFilter={columnsToShow}
      />
    </div>
  )
}
