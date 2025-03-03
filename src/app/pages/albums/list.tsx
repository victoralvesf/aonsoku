import { useInfiniteQuery } from '@tanstack/react-query'
import debounce from 'lodash/debounce'
import { useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getCoverArtUrl } from '@/api/httpClient'
import { EmptyAlbums } from '@/app/components/albums/empty-page'
import { AlbumsHeader } from '@/app/components/albums/header'
import { AlbumsFallback } from '@/app/components/fallbacks/album-fallbacks'
import ListWrapper from '@/app/components/list-wrapper'
import { PreviewCard } from '@/app/components/preview-card/card'
import {
  albumSearch,
  getAlbumList,
  getArtistDiscography,
} from '@/queries/albums'
import { ROUTES } from '@/routes/routesList'
import { subsonic } from '@/service/subsonic'
import { usePlayerActions } from '@/store/player.store'
import { AlbumListType } from '@/types/responses/album'
import {
  AlbumsFilters,
  AlbumsSearchParams,
  YearFilter,
  YearSortOptions,
} from '@/utils/albumsFilter'
import { queryKeys } from '@/utils/queryKeys'
import { getMainScrollElement } from '@/utils/scrollPageToTop'
import { SearchParamsHandler } from '@/utils/searchParamsHandler'

export default function AlbumsList() {
  const [searchParams] = useSearchParams()
  const { getSearchParam } = new SearchParamsHandler(searchParams)
  const defaultOffset = 128
  const oldestYear = '0001'
  const currentYear = new Date().getFullYear().toString()

  const scrollDivRef = useRef<HTMLDivElement | null>(null)
  const { setSongList } = usePlayerActions()

  const currentFilter = getSearchParam<AlbumListType>(
    AlbumsSearchParams.MainFilter,
    AlbumsFilters.RecentlyAdded,
  )
  const yearFilter = getSearchParam<YearFilter>(
    AlbumsSearchParams.YearFilter,
    YearSortOptions.Oldest,
  )
  const genre = getSearchParam<string>(AlbumsSearchParams.Genre, '')
  const artistId = getSearchParam<string>(AlbumsSearchParams.ArtistId, '')
  const query = getSearchParam<string>(AlbumsSearchParams.Query, '')

  useEffect(() => {
    scrollDivRef.current = getMainScrollElement()
  }, [])

  function getYearRange() {
    if (yearFilter === YearSortOptions.Oldest) {
      return [oldestYear, currentYear]
    } else {
      return [currentYear, oldestYear]
    }
  }

  const [fromYear, toYear] = getYearRange()

  const fetchAlbums = async ({ pageParam = 0 }) => {
    if (artistId !== '') {
      return getArtistDiscography(artistId)
    }

    if (currentFilter === AlbumsFilters.Search && query !== '') {
      return albumSearch({
        query,
        count: defaultOffset,
        offset: pageParam,
      })
    }

    return getAlbumList({
      type: currentFilter,
      size: defaultOffset,
      offset: pageParam,
      fromYear,
      toYear,
      genre,
    })
  }

  function enableMainQuery() {
    if (currentFilter === AlbumsFilters.ByGenre && genre === '') return false

    return true
  }

  const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery({
    queryKey: [queryKeys.album.all, currentFilter, yearFilter, genre, query],
    queryFn: fetchAlbums,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextOffset,
    enabled: enableMainQuery(),
  })

  useEffect(() => {
    const handleScroll = debounce(() => {
      if (!scrollDivRef.current) return

      const { scrollTop, clientHeight, scrollHeight } = scrollDivRef.current

      const isNearBottom =
        scrollTop + clientHeight >= scrollHeight - scrollHeight / 4

      if (isNearBottom) {
        if (hasNextPage) fetchNextPage()
      }
    }, 200)

    const scrollElement = scrollDivRef.current
    scrollElement?.addEventListener('scroll', handleScroll)
    return () => {
      scrollElement?.removeEventListener('scroll', handleScroll)
    }
  }, [fetchNextPage, hasNextPage])

  async function handlePlayAlbum(albumId: string) {
    const album = await subsonic.albums.getOne(albumId)

    if (album) {
      setSongList(album.song, 0)
    }
  }

  if (isLoading) return <AlbumsFallback />
  if (!data) return <EmptyAlbums />

  const items = data.pages.flatMap((page) => page.albums) || []
  const itemsCount = data.pages[data.pages.length - 1].albumsCount || 0

  if (items.length === 0) return <EmptyAlbums />

  return (
    <div className="w-full h-full">
      <AlbumsHeader albumCount={itemsCount} />

      <ListWrapper className="pt-[--shadow-header-distance]">
        <div
          className="grid grid-cols-6 2xl:grid-cols-8 gap-4 h-full"
          data-testid="albums-grid"
        >
          {items.map((album) => (
            <PreviewCard.Root key={`album-${album.id}`}>
              <PreviewCard.ImageWrapper link={ROUTES.ALBUM.PAGE(album.id)}>
                <PreviewCard.Image
                  src={getCoverArtUrl(album.coverArt, 'album', '300')}
                  alt={album.name}
                />
                <PreviewCard.PlayButton
                  onClick={() => handlePlayAlbum(album.id)}
                />
              </PreviewCard.ImageWrapper>
              <PreviewCard.InfoWrapper>
                <PreviewCard.Title link={ROUTES.ALBUM.PAGE(album.id)}>
                  {album.name}
                </PreviewCard.Title>
                <PreviewCard.Subtitle
                  enableLink={album.artistId !== undefined}
                  link={ROUTES.ARTIST.PAGE(album.artistId)}
                >
                  {album.artist}
                </PreviewCard.Subtitle>
              </PreviewCard.InfoWrapper>
            </PreviewCard.Root>
          ))}
        </div>
      </ListWrapper>
    </div>
  )
}
