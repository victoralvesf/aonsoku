import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useLoaderData } from 'react-router-dom'

import ListWrapper from '@/app/components/list-wrapper'
import { ShadowHeader } from '@/app/components/shadow-header'
import { ArtistSeparator, ISimilarArtist } from '@/types/responses/artist'
import { artistsColumns } from '@/app/tables/artists-columns'
import { DataTable } from '@/app/components/ui/data-table'
import { Badge } from '@/app/components/ui/badge'

export default function ArtistsList() {
  const { t } = useTranslation()
  const list = useLoaderData() as ArtistSeparator[]

  const memoizedArtistsColumns = useMemo(
    () => artistsColumns(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [list],
  )

  const organizeArtists = useCallback(() => {
    const artistsList: ISimilarArtist[] = []
    list.forEach((item) => {
      artistsList.push(...item.artist)
    })
    return artistsList
  }, [list])

  const artists = useMemo(() => organizeArtists(), [organizeArtists])

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

      <ListWrapper className="mt-8">
        <DataTable
          columns={memoizedArtistsColumns}
          data={artists}
          showPagination={true}
        />
      </ListWrapper>
    </main>
  )
}
