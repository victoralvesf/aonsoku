import { useCallback, useEffect, useRef, useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import HomeSongCard from '@/app/components/home/song-card';
import ListWrapper from '@/app/components/list-wrapper';
import { subsonic } from '@/service/subsonic';
import { AlbumListType, Albums } from '@/types/responses/album';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu"
import { ListFilter } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

export default function AlbumList() {
  const defaultOffset = 32
  const toYear = new Date().getFullYear().toString()
  const scrollDivRef = useRef<HTMLDivElement | null>(null);

  const recentSongs = useLoaderData() as Albums[];
  const [items, setItems] = useState<Albums[]>([])
  const [hasMore, setHasMore] = useState(true)
  const [offset, setOffset] = useState(defaultOffset)
  const [currentFilter, setCurrentFilter] = useState<AlbumListType>('newest')

  useEffect(() => {
    setItems(recentSongs)
    scrollDivRef.current = document.querySelector('#main-scroll-area #scroll-viewport') as HTMLDivElement
  }, [])

  const fetchMoreData = useCallback(async () => {
    const response = await subsonic.albums.getAlbumList({
      type: currentFilter,
      size: defaultOffset,
      offset,
      toYear,
    })

    if (response) {
      setItems((prevItems) => [...prevItems, ...response])
      response.length < defaultOffset ? setHasMore(false) : setHasMore(true)
    }

    setOffset((prevOffset) => prevOffset + defaultOffset)
  }, [offset, currentFilter])

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
      setItems([])
      setItems(response);
      scrollDivRef.current?.scrollTo(0, 0)
    }
  }, [currentFilter]);

  useEffect(() => {
    resetList()
  }, [currentFilter, resetList])

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollDivRef.current) return;

      const { scrollTop, clientHeight, scrollHeight } = scrollDivRef.current
      if (scrollTop + clientHeight >= scrollHeight - 40) {
        if (hasMore) fetchMoreData()
      }
    };

    const scrollElement = scrollDivRef.current;
    scrollElement?.addEventListener("scroll", handleScroll);
    return () => {
      scrollElement?.removeEventListener("scroll", handleScroll);
    };
  }, [fetchMoreData]);

  return (
    <main className="w-full h-full">
      <div className="flex items-center justify-start px-8 py-4 sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-lg shadow-b-2 -shadow-spread-2">
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold tracking-tight">
            Albums
          </h2>

          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <ListFilter className="w-4 h-4 mr-2" />
                  {filterList[currentFilter]}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {Object.keys(filterList).map((filter, index) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={index}
                      checked={filter === currentFilter}
                      onCheckedChange={() => setCurrentFilter(filter as keyof typeof filterList)}
                      className="cursor-pointer"
                    >
                      {filterList[filter as keyof typeof filterList]}
                    </DropdownMenuCheckboxItem>
                  )
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <ListWrapper className="pt-6 lg:pt-8">
        <div className="grid grid-cols-8 gap-4 h-full">
          {items && items.map((album) => (
            <HomeSongCard
              key={album.id}
              album={album}
              coverArtSize={300}
              onButtonClick={() => console.log('yip')}
            />
          ))}
        </div>
      </ListWrapper>
    </main>
  )
}

const filterList = {
  alphabeticalByArtist: 'Artist',
  byGenre: 'Genre',
  highest: 'Highest',
  starred: 'Liked',
  frequent: 'Most Played',
  alphabeticalByName: 'Name',
  random: 'Random',
  newest: 'Recently Added',
  recent: 'Recently Played',
  byYear: 'Release Year'
}

