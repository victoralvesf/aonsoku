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
import { SearchParamsHandler } from '@/utils/searchParamsHandler'

const emptyResponse = { albums: [], nextOffset: null, albumsCount: 0 }

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
    scrollDivRef.current = document.querySelector(
      '#main-scroll-area #scroll-viewport',
    ) as HTMLDivElement
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
      const response = await subsonic.artists.getOne(artistId)

      if (!response) return emptyResponse

      return {
        albums: response.album,
        nextOffset: null,
        albumsCount: response.album.length,
      }
    }

    if (currentFilter === AlbumsFilters.Search && query !== '') {
      const response = await subsonic.search.get({
        query,
        songCount: 0,
        artistCount: 0,
        albumCount: 500,
      })

      if (!response) return emptyResponse
      if (!response.album) return emptyResponse

      return {
        albums: response.album,
        nextOffset: null,
        albumsCount: response.album.length,
      }
    }

    const response = await subsonic.albums.getAlbumList({
      type: currentFilter,
      size: defaultOffset,
      offset: pageParam,
      fromYear,
      toYear,
      genre,
    })

    let nextOffset = null
    if (response.list && response.list.length >= defaultOffset) {
      nextOffset = pageParam + defaultOffset
    }

    return {
      albums: response.list || [],
      nextOffset,
      albumsCount: response.albumsCount || 0,
    }
  }

  function enableMainQuery() {
    if (currentFilter === AlbumsFilters.ByGenre && genre === '') return false

    return true
  }

  const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery({
    queryKey: [queryKeys.album.all, currentFilter, yearFilter, genre],
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
  const itemsCount = data.pages[0].albumsCount || 0

  if (items.length === 0) return <EmptyAlbums />

  return (
    <div className="w-full h-full">
      <AlbumsHeader albumCount={itemsCount} />

      <ListWrapper className="pt-[--shadow-header-distance]">
        <div
          className="grid grid-cols-5 2xl:grid-cols-8 gap-4 h-full"
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
