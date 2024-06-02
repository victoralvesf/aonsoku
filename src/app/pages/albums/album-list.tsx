import { useCallback, useEffect, useRef, useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import HomeSongCard from '@/app/components/home/song-card';
import ListWrapper from '@/app/components/list-wrapper';
import { subsonic } from '@/service/subsonic';
import { AlbumListType, Albums, AlbumsListData } from '@/types/responses/album';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu"
import { ListFilter } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import debounce from 'lodash/debounce';
import { usePlayer } from '@/app/contexts/player-context';
import { Badge } from '@/app/components/ui/badge';
import { useTranslation } from 'react-i18next';

export default function AlbumList() {
  const defaultOffset = 32
  const toYear = new Date().getFullYear().toString()
  const scrollDivRef = useRef<HTMLDivElement | null>(null);
  const { setSongList } = usePlayer()
  const { t } = useTranslation()

  const { albumsCount, list: recentAlbums } = useLoaderData() as AlbumsListData;
  const [items, setItems] = useState<Albums[]>([])
  const [itemsCount, setItemsCount] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [offset, setOffset] = useState(defaultOffset)
  const [currentFilter, setCurrentFilter] = useState<AlbumListType>('newest')

  useEffect(() => {
    setItems(recentAlbums)
    setItemsCount(albumsCount)
    scrollDivRef.current = document.querySelector('#main-scroll-area #scroll-viewport') as HTMLDivElement
  }, [recentAlbums])

  const fetchMoreData = useCallback(async () => {
    const response = await subsonic.albums.getAlbumList({
      type: currentFilter,
      size: defaultOffset,
      offset,
      toYear,
    })

    if (response) {
      setItems((prevItems) => {
        const newItems = response.list!.filter(album => !prevItems.some(item => item.id === album.id));
        return [...prevItems, ...newItems];
      })
      setItemsCount(response.albumsCount!)
      setHasMore(response.list!.length >= defaultOffset)
    }

    setOffset((prevOffset) => prevOffset + defaultOffset)
  }, [offset, currentFilter, defaultOffset, toYear])

  const resetList = useCallback(async () => {
    setOffset(defaultOffset);
    setHasMore(true);

    const response = await subsonic.albums.getAlbumList({
      type: currentFilter,
      size: defaultOffset,
      offset: 0,
      toYear,
    });

    if (response) {
      setItems(response.list!)
      setItemsCount(response.albumsCount!)
      scrollDivRef.current?.scrollTo(0, 0)
    }
  }, [currentFilter, defaultOffset, toYear]);

  useEffect(() => {
    resetList()
  }, [currentFilter, resetList])

  useEffect(() => {
    const handleScroll = debounce(() => {
      if (!scrollDivRef.current) return;

      const { scrollTop, clientHeight, scrollHeight } = scrollDivRef.current
      if (scrollTop + clientHeight >= scrollHeight - 40) {
        if (hasMore) fetchMoreData()
      }
    }, 200);

    const scrollElement = scrollDivRef.current;
    scrollElement?.addEventListener("scroll", handleScroll);
    return () => {
      scrollElement?.removeEventListener("scroll", handleScroll);
    };
  }, [fetchMoreData, hasMore]);

  async function handlePlayAlbum(albumId: string) {
    const album = await subsonic.albums.getOne(albumId)

    if (album) {
      setSongList(album.song, 0)
    }
  }

  return (
    <main className="w-full h-full">
      <div className="flex items-center justify-start px-8 py-4 sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-lg shadow-b-2 -shadow-spread-2">
        <div className="w-full flex justify-between">
          <div className="flex gap-2 items-center">
            <h2 className="text-2xl font-semibold tracking-tight">
              {t('sidebar.albums')}
            </h2>
            <Badge variant="secondary" className="text-foreground/70">{itemsCount}</Badge>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <ListFilter className="w-4 h-4 mr-2" />
                {t(filterList[currentFilter])}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {Object.entries(filterList).map(([key, label], index) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={index}
                    checked={key === currentFilter}
                    onCheckedChange={() => setCurrentFilter(key as AlbumListType)}
                    className="cursor-pointer"
                  >
                    {t(label)}
                  </DropdownMenuCheckboxItem>
                )
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <ListWrapper className="pt-6 lg:pt-8">
        <div className="grid grid-cols-8 gap-4 h-full">
          {items && items.map((album) => (
            <HomeSongCard
              key={`album-${album.id}`}
              album={album}
              coverArtSize={300}
              onButtonClick={(album) => handlePlayAlbum(album.id)}
            />
          ))}
        </div>
      </ListWrapper>
    </main>
  )
}

const filterList = {
  alphabeticalByArtist: 'album.list.filter.artist',
  byGenre: 'album.list.filter.genre',
  highest: 'album.list.filter.highest',
  starred: 'album.list.filter.favorites',
  frequent: 'album.list.filter.mostPlayed',
  alphabeticalByName: 'album.list.filter.name',
  random: 'album.list.filter.random',
  newest: 'album.list.filter.recentlyAdded',
  recent: 'album.list.filter.recentlyPlayed',
  byYear: 'album.list.filter.releaseYear',
}
