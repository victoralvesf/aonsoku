import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useLoaderData } from 'react-router-dom'

import ListWrapper from '@/app/components/list-wrapper'
import { ShadowHeader } from '@/app/components/shadow-header'
import { ArtistSeparator, ISimilarArtist } from '@/types/responses/artist'
import { artistsColumns } from '@/app/tables/artists-columns'
import { DataTable } from '@/app/components/ui/data-table'
import { Badge } from '@/app/components/ui/badge'
import { useLang } from '@/app/contexts/lang-context'
import { useSongList } from '@/app/hooks/use-song-list'
import { usePlayer } from '@/app/contexts/player-context'

export default function ArtistsList() {
  const list = useLoaderData() as ArtistSeparator[]
  const { t } = useTranslation()
  const { langCode } = useLang()
  const { getArtistAllSongs } = useSongList()
  const player = usePlayer()

  const memoizedArtistsColumns = useMemo(
    () => artistsColumns(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [list, langCode],
  )

  const organizeArtists = useCallback(() => {
    const artistsList: ISimilarArtist[] = []
    list.forEach((item) => {
      artistsList.push(...item.artist)
    })
    return artistsList.sort((a, b) => a.name.localeCompare(b.name))
  }, [list])

  const artists = useMemo(() => organizeArtists(), [organizeArtists])

  async function handlePlayArtistRadio(artist: ISimilarArtist) {
    const songList = await getArtistAllSongs(artist.name)

    if (songList) player.setSongList(songList, 0)
  }

  return (
    <main className="w-full h-full">
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

      <ListWrapper className="mt-6">
        <DataTable
          columns={memoizedArtistsColumns}
          data={artists}
          showPagination={true}
          showSearch={true}
          searchColumn="name"
          handlePlaySong={(row) => handlePlayArtistRadio(row.original)}
        />
      </ListWrapper>
    </main>
  )
}
