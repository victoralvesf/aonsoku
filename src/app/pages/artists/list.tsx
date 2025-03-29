import { useQuery } from '@tanstack/react-query'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'

import { ShadowHeader } from '@/app/components/album/shadow-header'
import { ArtistsGridView } from '@/app/components/artist/artists-grid-view'
import { ArtistsFallback } from '@/app/components/fallbacks/artists.tsx'
import { HeaderTitle } from '@/app/components/header-title'
import ListWrapper from '@/app/components/list-wrapper'
import { MainViewTypeSelector } from '@/app/components/main-grid'
import { DataTable } from '@/app/components/ui/data-table'
import { useSongList } from '@/app/hooks/use-song-list'
import { artistsColumns } from '@/app/tables/artists-columns'
import { subsonic } from '@/service/subsonic'
import { useAppArtistsViewType } from '@/store/app.store'
import { usePlayerActions } from '@/store/player.store'
import { ISimilarArtist } from '@/types/responses/artist'
import { queryKeys } from '@/utils/queryKeys'

const MemoDataTable = memo(DataTable) as typeof DataTable
const MemoArtistsGridView = memo(ArtistsGridView)

export default function ArtistsList() {
  const { t } = useTranslation()
  const { getArtistAllSongs } = useSongList()
  const { setSongList } = usePlayerActions()
  const {
    artistsPageViewType,
    setArtistsPageViewType,
    isTableView,
    isGridView,
  } = useAppArtistsViewType()

  const columns = artistsColumns()

  const { data: artists, isLoading } = useQuery({
    queryKey: [queryKeys.artist.all],
    queryFn: subsonic.artists.getAll,
  })

  async function handlePlayArtistRadio(artist: ISimilarArtist) {
    const songList = await getArtistAllSongs(artist.name)

    if (songList) setSongList(songList, 0)
  }

  if (isLoading) return <ArtistsFallback />
  if (!artists) return null

  return (
    <div className="w-full h-full">
      <ShadowHeader className="flex justify-between">
        <HeaderTitle title={t('sidebar.artists')} count={artists.length} />

        <div>
          <MainViewTypeSelector
            viewType={artistsPageViewType}
            setViewType={setArtistsPageViewType}
          />
        </div>
      </ShadowHeader>

      {isTableView && (
        <ListWrapper className="pt-shadow-header-distance">
          <MemoDataTable
            columns={columns}
            data={artists}
            showPagination={true}
            showSearch={true}
            searchColumn="name"
            handlePlaySong={(row) => handlePlayArtistRadio(row.original)}
            allowRowSelection={false}
            dataType="artist"
          />
        </ListWrapper>
      )}

      {isGridView && (
        <ListWrapper className="pt-shadow-header-distance px-0">
          <MemoArtistsGridView artists={artists} />
        </ListWrapper>
      )}
    </div>
  )
}
