import { useInfiniteQuery } from '@tanstack/react-query'
import debounce from 'lodash/debounce'
import { ArrowDown, ArrowUp, ListFilter } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ShadowHeader } from '@/app/components/album/shadow-header'
import HomeSongCard from '@/app/components/home/song-card'
import ListWrapper from '@/app/components/list-wrapper'
import { Badge } from '@/app/components/ui/badge'
import { Button } from '@/app/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu'
import { SimpleTooltip } from '@/app/components/ui/simple-tooltip'
import { subsonic } from '@/service/subsonic'
import { usePlayerActions } from '@/store/player.store'
import { AlbumListType } from '@/types/responses/album'
import { albumsPageFilterValues } from '@/utils/albumsPageFilterValues'
import { queryKeys } from '@/utils/queryKeys'

export default function AlbumsList() {
  const defaultOffset = 128
  const oldestYear = '0001'
  const currentYear = new Date().getFullYear().toString()

  const scrollDivRef = useRef<HTMLDivElement | null>(null)
  const { setSongList } = usePlayerActions()
  const { t } = useTranslation()

  const [currentFilter, setCurrentFilter] = useState<AlbumListType>('newest')
  const [yearFilter, setYearFilter] = useState<'oldest' | 'newest'>('oldest')

  useEffect(() => {
    scrollDivRef.current = document.querySelector(
      '#main-scroll-area #scroll-viewport',
    ) as HTMLDivElement
  }, [])

  const fetchAlbums = async ({ pageParam = 0 }) => {
    const response = await subsonic.albums.getAlbumList({
      type: currentFilter,
      size: defaultOffset,
      offset: pageParam,
      fromYear: yearFilter === 'oldest' ? oldestYear : currentYear,
      toYear: yearFilter === 'oldest' ? currentYear : oldestYear,
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

  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: [queryKeys.album.all, currentFilter, yearFilter],
    queryFn: fetchAlbums,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextOffset,
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

  const currentFilterLabel = albumsPageFilterValues.filter(
    (item) => item.key === currentFilter,
  )[0].label

  if (!data) return null

  const items = data.pages.flatMap((page) => page.albums) || []
  const itemsCount = data.pages[0].albumsCount || 0

  return (
    <div className="w-full h-full">
      <ShadowHeader>
        <div className="w-full flex justify-between">
          <div className="flex gap-2 items-center">
            <h2 className="text-2xl font-semibold tracking-tight">
              {t('sidebar.albums')}
            </h2>
            <Badge variant="secondary" className="text-foreground/70">
              {itemsCount}
            </Badge>
          </div>

          <div className="flex gap-2">
            {currentFilter === 'byYear' && (
              <SimpleTooltip
                text={t(
                  `table.sort.${yearFilter === 'oldest' ? 'asc' : 'desc'}`,
                )}
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setYearFilter((current) =>
                      current === 'newest' ? 'oldest' : 'newest',
                    )
                  }}
                >
                  {yearFilter === 'oldest' ? (
                    <ArrowUp className="w-4 h-4" />
                  ) : (
                    <ArrowDown className="w-4 h-4" />
                  )}
                </Button>
              </SimpleTooltip>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <ListFilter className="w-4 h-4 mr-2" />
                  {t(currentFilterLabel)}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {albumsPageFilterValues.map((item, index) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={index}
                      checked={item.key === currentFilter}
                      onCheckedChange={() =>
                        setCurrentFilter(item.key as AlbumListType)
                      }
                      className="cursor-pointer"
                    >
                      {t(item.label)}
                    </DropdownMenuCheckboxItem>
                  )
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </ShadowHeader>

      <ListWrapper className="pt-[--shadow-header-distance]">
        <div className="grid grid-cols-5 2xl:grid-cols-8 gap-4 h-full">
          {items.map((album) => (
            <HomeSongCard
              key={`album-${album.id}`}
              album={album}
              coverArtSize={300}
              onButtonClick={(album) => handlePlayAlbum(album.id)}
            />
          ))}
        </div>
      </ListWrapper>
    </div>
  )
}
