import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useAsyncValue } from 'react-router-dom'
import { DataTable } from '@/app/components/ui/data-table'
import { songsColumns } from '@/app/tables/songs-columns'
import { usePlayerActions } from '@/store/player.store'
import { ColumnFilter } from '@/types/columnFilter'
import { ISong } from '@/types/responses/song'

export default function ArtistTopSongs() {
  const topSongs = useAsyncValue() as ISong[]
  const columns = songsColumns()

  const memoizedTopSongs = useMemo(() => {
    if (topSongs.length > 10) {
      return topSongs.slice(0, 10)
    } else {
      return topSongs
    }
  }, [topSongs])

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
        data={memoizedTopSongs}
        handlePlaySong={(row) => setSongList(memoizedTopSongs, row.index)}
        columnFilter={columnsToShow}
      />
    </div>
  )
}
