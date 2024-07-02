import { useTranslation } from 'react-i18next'
import { useLoaderData } from 'react-router-dom'
import ListWrapper from '@/app/components/list-wrapper'
import { ShadowHeader } from '@/app/components/shadow-header'
import { Badge } from '@/app/components/ui/badge'
import { DataTable } from '@/app/components/ui/data-table'
import { songsColumns } from '@/app/tables/songs-columns'
import { usePlayerActions } from '@/store/player.store'
import { ColumnFilter } from '@/types/columnFilter'
import { ISong } from '@/types/responses/song'

interface LoaderData {
  count: number
  songs: ISong[]
}

export default function SongsList() {
  const { count, songs } = useLoaderData() as LoaderData
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
    'starred',
  ]

  function handlePlaySong(index: number) {
    setSongList(songs, index)
  }

  return (
    <main className="w-full h-full">
      <ShadowHeader>
        <div className="flex gap-2 items-center">
          <h2 className="text-2xl font-semibold tracking-tight">
            {t('sidebar.songs')}
          </h2>
          <Badge variant="secondary" className="text-foreground/70">
            {count}
          </Badge>
        </div>
      </ShadowHeader>

      <ListWrapper className="mt-6">
        <DataTable
          columns={columns}
          data={songs}
          showPagination={true}
          showSearch={true}
          searchColumn="title"
          handlePlaySong={(row) => handlePlaySong(row.index)}
          columnFilter={columnsToShow}
        />
      </ListWrapper>
    </main>
  )
}
