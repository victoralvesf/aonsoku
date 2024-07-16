import { Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { Await, useLoaderData } from 'react-router-dom'
import { ShadowHeader } from '@/app/components/album/shadow-header'
import { SongsListFallback } from '@/app/components/fallbacks/song-fallbacks'
import ListWrapper from '@/app/components/list-wrapper'
import { Badge } from '@/app/components/ui/badge'
import { DataTable } from '@/app/components/ui/data-table'
import { songsColumns } from '@/app/tables/songs-columns'
import { usePlayerActions } from '@/store/player.store'
import { ColumnFilter } from '@/types/columnFilter'
import { Search } from '@/types/responses/search'
import { ISong } from '@/types/responses/song'
import { sortByString } from '@/utils/sort'

interface LoaderData {
  allSongsPromise: Promise<Search>
}

export default function SongsList() {
  const { allSongsPromise } = useLoaderData() as LoaderData

  return (
    <Suspense fallback={<SongsListFallback />}>
      <Await resolve={allSongsPromise} errorElement={<></>}>
        {(response: Search) => (
          <ResolvedSongList songlist={response.song ?? []} />
        )}
      </Await>
    </Suspense>
  )
}

function ResolvedSongList({ songlist }: { songlist: ISong[] }) {
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
    setSongList(songlist, index)
  }

  const songs = songlist.sort((a, b) => sortByString(a.title, b.title))
  const count = songlist.length

  return (
    <div className="w-full h-full">
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

      <ListWrapper className="pt-[--shadow-header-distance]">
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
    </div>
  )
}
