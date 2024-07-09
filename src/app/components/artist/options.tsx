import { OptionsButtons } from '@/app/components/options/buttons'
import { DropdownMenuGroup } from '@/app/components/ui/dropdown-menu'
import { useSongList } from '@/app/hooks/use-song-list'
import { usePlayerActions } from '@/store/player.store'
import { IArtist } from '@/types/responses/artist'
import { ISong } from '@/types/responses/song'

interface ArtistOptionsProps {
  artist: IArtist
}

export function ArtistOptions({ artist }: ArtistOptionsProps) {
  const { setNextOnQueue, setLastOnQueue } = usePlayerActions()
  const { getArtistAllSongs } = useSongList()

  async function getSongsToQueue(
    artistName: string,
    callback: (songs: ISong[]) => void,
  ) {
    const songs = await getArtistAllSongs(artistName)
    if (!songs) return

    callback(songs)
  }

  async function handlePlayNext() {
    await getSongsToQueue(artist.name, (songs) => setNextOnQueue(songs))
  }

  async function handlePlayLast() {
    await getSongsToQueue(artist.name, (songs) => setLastOnQueue(songs))
  }

  return (
    <>
      <DropdownMenuGroup>
        <OptionsButtons.PlayNext onClick={() => handlePlayNext()} />
        <OptionsButtons.PlayLast onClick={() => handlePlayLast()} />
      </DropdownMenuGroup>
    </>
  )
}
