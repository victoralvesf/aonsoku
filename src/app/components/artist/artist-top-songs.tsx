import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { DataTable } from '@/app/components/ui/data-table'
import { songsColumns } from '@/app/tables/songs-columns'
import { ROUTES } from '@/routes/routesList'
import { usePlayerActions } from '@/store/player.store'
import { ColumnFilter } from '@/types/columnFilter'
import { IArtist } from '@/types/responses/artist'
import { ISong } from '@/types/responses/song'

interface TopSongsProps {
  topSongs: ISong[]
  artist: IArtist
}

export default function ArtistTopSongs({ topSongs, artist }: TopSongsProps) {
  const { t } = useTranslation()
  const { setSongList } = usePlayerActions()
  const columns = songsColumns()
  const topTenSongs = topSongs.length > 10 ? topSongs.slice(0, 10) : topSongs
  const { id, name } = artist

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
      <div className="flex items-center justify-between mb-4">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          {t('artist.topSongs')}
        </h3>

        <Link
          to={ROUTES.SONGS.ARTIST_TRACKS(id, name)}
          className="h-full"
          data-testid="view-all-tracks-link"
        >
          <p className="leading-7 text-sm truncate hover:underline text-muted-foreground hover:text-primary">
            {t('generic.viewAll')}
          </p>
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={topTenSongs}
        handlePlaySong={(row) => setSongList(topTenSongs, row.index)}
        columnFilter={columnsToShow}
        variant="modern"
      />
    </div>
  )
}
