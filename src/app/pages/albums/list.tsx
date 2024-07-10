import debounce from 'lodash/debounce'
import { ListFilter } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
import { subsonic } from '@/service/subsonic'
import { usePlayerActions } from '@/store/player.store'
import { AlbumListType, Albums, AlbumsListData } from '@/types/responses/album'

export default function AlbumsList() {
  const defaultOffset = 32
  const toYear = new Date().getFullYear().toString()
  const scrollDivRef = useRef<HTMLDivElement | null>(null)
  const { setSongList } = usePlayerActions()
  const { t } = useTranslation()

  const { albumsCount, list: recentAlbums } = useLoaderData() as AlbumsListData
  const [items, setItems] = useState<Albums[]>([])
  const [itemsCount, setItemsCount] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [offset, setOffset] = useState(defaultOffset)
  const [currentFilter, setCurrentFilter] = useState<AlbumListType>('newest')

  useEffect(() => {
    setItems(recentAlbums)
    setItemsCount(albumsCount)
    scrollDivRef.current = document.querySelector(
      '#main-scroll-area #scroll-viewport',
    ) as HTMLDivElement
  }, [albumsCount, recentAlbums])

  const fetchMoreData = useCallback(async () => {
    const response = await subsonic.albums.getAlbumList({
      type: currentFilter,
      size: defaultOffset,
      offset,
      toYear,
    })

    if (response) {
      setItems((prevItems) => {
        const newItems = response.list!.filter(
          (album) => !prevItems.some((item) => item.id === album.id),
        )
        return [...prevItems, ...newItems]
      })
      setItemsCount(response.albumsCount!)
      setHasMore(response.list!.length >= defaultOffset)
    }

    setOffset((prevOffset) => prevOffset + defaultOffset)
  }, [offset, currentFilter, defaultOffset, toYear])

  const resetList = useCallback(async () => {
    setOffset(defaultOffset)
    setHasMore(true)

    const response = await subsonic.albums.getAlbumList({
      type: currentFilter,
      size: defaultOffset,
      offset: 0,
      toYear,
    })

    if (response) {
      setItems(response.list!)
      setItemsCount(response.albumsCount!)
      scrollDivRef.current?.scrollTo(0, 0)
    }
  }, [currentFilter, defaultOffset, toYear])

  useEffect(() => {
    resetList()
  }, [currentFilter, resetList])

  useEffect(() => {
    const handleScroll = debounce(() => {
      if (!scrollDivRef.current) return

      const { scrollTop, clientHeight, scrollHeight } = scrollDivRef.current
      if (scrollTop + clientHeight >= scrollHeight - 40) {
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

  const filterList = useMemo(() => {
    return [
      {
        key: 'alphabeticalByArtist',
        label: t('album.list.filter.artist'),
      },
      {
        key: 'byGenre',
        label: t('album.list.filter.genre'),
      },
      {
        key: 'highest',
        label: t('album.list.filter.highest'),
      },
      {
        key: 'starred',
        label: t('album.list.filter.favorites'),
      },
      {
        key: 'frequent',
        label: t('album.list.filter.mostPlayed'),
      },
      {
        key: 'alphabeticalByName',
        label: t('album.list.filter.name'),
      },
      {
        key: 'random',
        label: t('album.list.filter.random'),
      },
      {
        key: 'newest',
        label: t('album.list.filter.recentlyAdded'),
      },
      {
        key: 'recent',
        label: t('album.list.filter.recentlyPlayed'),
      },
      {
        key: 'byYear',
        label: t('album.list.filter.releaseYear'),
      },
    ]
  }, [t])

  const currentFilterLabel = filterList.filter(
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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <ListFilter className="w-4 h-4 mr-2" />
                {currentFilterLabel}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {filterList.map((item, index) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={index}
                    checked={item.key === currentFilter}
                    onCheckedChange={() =>
                      setCurrentFilter(item.key as AlbumListType)
                    }
                    className="cursor-pointer"
                  >
                    {item.label}
                  </DropdownMenuCheckboxItem>
                )
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </ShadowHeader>

      <ListWrapper className="pt-[--shadow-header-distance]">
        <div className="grid grid-cols-8 gap-4 h-full">
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
