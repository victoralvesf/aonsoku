import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useAsyncValue } from 'react-router-dom'
import { DataTable } from '@/app/components/ui/data-table'
import { Skeleton } from '@/app/components/ui/skeleton'
import { useLang } from '@/app/contexts/lang-context'
import { usePlayer } from '@/app/contexts/player-context'
import { songsColumns } from '@/app/tables/songs-columns'
import { ColumnFilter } from '@/types/columnFilter'
import { ISong } from '@/types/responses/song'

export default function ArtistTopSongs() {
  const topSongs = useAsyncValue() as ISong[]
  const { langCode } = useLang()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedSongsColumns = useMemo(() => songsColumns(), [langCode])
  const memoizedTopSongs = useMemo(() => {
    if (topSongs.length > 10) {
      return topSongs.slice(0, 10)
    } else {
      return topSongs
    }
  }, [topSongs])

  const player = usePlayer()
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
    'starred',
  ]

  return (
    <div className="w-full mb-4">
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-4 mt-6">
        {t('artist.topSongs')}
      </h3>

      <DataTable
        columns={memoizedSongsColumns}
        data={memoizedTopSongs}
        handlePlaySong={(row) =>
          player.setSongList(memoizedTopSongs, row.index)
        }
        columnFilter={columnsToShow}
      />
    </div>
  )
}

export function ArtistTopSongsFallback() {
  return (
    <div className="w-full">
      <Skeleton className="w-28 h-8 mb-4 mt-6 rounded" />

      <div className="w-full border rounded-md">
        <div className="grid grid-cols-table-fallback py-4 px-2 items-center">
          <Skeleton className="w-5 h-5 rounded ml-2" />
          <Skeleton className="w-8 h-5 rounded" />
          <Skeleton className="w-16 h-5 rounded" />
          <Skeleton className="w-16 h-5 rounded" />
          <Skeleton className="w-12 h-5 rounded" />
          <Skeleton className="w-16 h-5 rounded" />
          <Skeleton className="w-12 h-5 rounded" />
        </div>
        {Array.from({ length: 10 }).map((_, index) => (
          <div
            key={index}
            className="grid grid-cols-table-fallback p-2 items-center border-t"
          >
            <Skeleton className="w-5 h-5 rounded ml-2" />
            <div className="flex items-center gap-2">
              <Skeleton className="w-10 h-10 rounded" />
              <Skeleton className="w-36 h-5 rounded" />
            </div>
            <Skeleton className="w-36 h-5 rounded" />
            <Skeleton className="w-12 h-5 rounded" />
            <Skeleton className="w-6 h-5 rounded" />
            <Skeleton className="w-20 h-5 rounded" />
            <Skeleton className="w-14 h-5 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  )
}
