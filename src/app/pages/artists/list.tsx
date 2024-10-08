import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { ShadowHeader } from '@/app/components/album/shadow-header'
import { SongsListFallback } from '@/app/components/fallbacks/song-fallbacks'
import ListWrapper from '@/app/components/list-wrapper'
import { Badge } from '@/app/components/ui/badge'
import { DataTable } from '@/app/components/ui/data-table'
import { useSongList } from '@/app/hooks/use-song-list'
import { artistsColumns } from '@/app/tables/artists-columns'
import { subsonic } from '@/service/subsonic'
import { usePlayerActions } from '@/store/player.store'
import { ISimilarArtist } from '@/types/responses/artist'
import { queryKeys } from '@/utils/queryKeys'

export default function ArtistsList() {
  const { t } = useTranslation()
  const { getArtistAllSongs } = useSongList()
  const { setSongList } = usePlayerActions()

  const columns = artistsColumns()

  const { data: artists, isLoading } = useQuery({
    queryKey: [queryKeys.artist.all],
    queryFn: subsonic.artists.getAll,
  })

  async function handlePlayArtistRadio(artist: ISimilarArtist) {
    const songList = await getArtistAllSongs(artist.name)

    if (songList) setSongList(songList, 0)
  }

  if (isLoading) return <SongsListFallback />
  if (!artists) return null

  return (
    <div className="w-full h-full">
      <ShadowHeader>
        <div className="flex gap-2 items-center">
          <h2 className="text-2xl font-semibold tracking-tight">
            {t('sidebar.artists')}
          </h2>
          <Badge variant="secondary" className="text-foreground/70">
            {artists.length}
          </Badge>
        </div>
      </ShadowHeader>

      <ListWrapper className="pt-[--shadow-header-distance]">
        <DataTable
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
    </div>
  )
}
