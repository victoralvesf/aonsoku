import debounce from 'lodash/debounce'
import { ArrowDown, ArrowUp, ListFilter } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLoaderData } from 'react-router-dom'
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
import { AlbumListType, Albums, AlbumsListData } from '@/types/responses/album'
import { albumsPageFilterValues } from '@/utils/albumsPageFilterValues'

export default function AlbumsList() {
  const defaultOffset = 32
  const oldestYear = '0001'
  const currentYear = new Date().getFullYear().toString()

  const scrollDivRef = useRef<HTMLDivElement | null>(null)
  const { setSongList } = usePlayerActions()
  const { t } = useTranslation()

  const { albumsCount, list: recentAlbums } = useLoaderData() as AlbumsListData
  const [items, setItems] = useState<Albums[]>([])
  const [itemsCount, setItemsCount] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [offset, setOffset] = useState(defaultOffset)
  const [currentFilter, setCurrentFilter] = useState<AlbumListType>('newest')
  const [yearFilter, setYearFilter] = useState<'oldest' | 'newest'>('oldest')

  useEffect(() => {
    setItems(recentAlbums)
  }, [recentAlbums])

  useEffect(() => {
    setItemsCount(albumsCount)
  }, [albumsCount])

  useEffect(() => {
    scrollDivRef.current = document.querySelector(
      '#main-scroll-area #scroll-viewport',
    ) as HTMLDivElement
  }, [])

  const fetchMoreData = useCallback(async () => {
    const response = await subsonic.albums.getAlbumList({
      type: currentFilter,
      size: defaultOffset,
      offset,
      fromYear: yearFilter === 'oldest' ? oldestYear : currentYear,
      toYear: yearFilter === 'oldest' ? currentYear : oldestYear,
    })

    if (response && response.albumsCount) {
      setItems((prevItems) => {
        if (!response.list) return prevItems

        const newItems = response.list.filter(
          (album) => !prevItems.some((item) => item.id === album.id),
        )
        return [...prevItems, ...newItems]
      })
      setItemsCount(response.albumsCount)
      setHasMore(response.list!.length >= defaultOffset)
    }

    setOffset((prevOffset) => prevOffset + defaultOffset)
  }, [currentFilter, offset, yearFilter, currentYear])

  const resetList = useCallback(async () => {
    setOffset(defaultOffset)
    setHasMore(true)

    const response = await subsonic.albums.getAlbumList({
      type: currentFilter,
      size: defaultOffset,
      offset: 0,
      fromYear: yearFilter === 'oldest' ? oldestYear : currentYear,
      toYear: yearFilter === 'oldest' ? currentYear : oldestYear,
    })

    if (response) {
      setItems(response.list!)
      setItemsCount(response.albumsCount!)
      scrollDivRef.current?.scrollTo(0, 0)
    }
  }, [currentFilter, currentYear, yearFilter])

  useEffect(() => {
    resetList()
  }, [currentFilter, resetList])

  useEffect(() => {
    const handleScroll = debounce(() => {
      if (!scrollDivRef.current) return

      const { scrollTop, clientHeight, scrollHeight } = scrollDivRef.current
      if (scrollTop + clientHeight >= scrollHeight - 200) {
        if (hasMore) fetchMoreData()
      }
    }, 200)

    const scrollElement = scrollDivRef.current
    scrollElement?.addEventListener('scroll', handleScroll)
    return () => {
      scrollElement?.removeEventListener('scroll', handleScroll)
    }
  }, [fetchMoreData, hasMore])

  async function handlePlayAlbum(albumId: string) {
    const album = await subsonic.albums.getOne(albumId)

    if (album) {
      setSongList(album.song, 0)
    }
  }

  const currentFilterLabel = albumsPageFilterValues.filter(
    (item) => item.key === currentFilter,
  )[0].label

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
          {items &&
            items.map((album) => (
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
