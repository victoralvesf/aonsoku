import { getDownloadUrl } from '@/api/httpClient'
import { OptionsButtons } from '@/app/components/options/buttons'
import {
  DropdownMenuGroup,
  DropdownMenuSeparator,
} from '@/app/components/ui/dropdown-menu'
import { useDownload } from '@/app/hooks/use-download'
import { useSongList } from '@/app/hooks/use-song-list'
import { usePlayerActions } from '@/store/player.store'
import { IArtist } from '@/types/responses/artist'
import { ISong } from '@/types/responses/song'
import { isTauri } from '@/utils/tauriTools'

interface ArtistOptionsProps {
  artist: IArtist
}

export function ArtistOptions({ artist }: ArtistOptionsProps) {
  const { setNextOnQueue, setLastOnQueue } = usePlayerActions()
  const { getArtistAllSongs } = useSongList()
  const { downloadBrowser, downloadTauri } = useDownload()

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

  async function handleDownload() {
    const url = getDownloadUrl(artist.id)
    if (isTauri()) {
      downloadTauri(url, artist.id)
    } else {
      downloadBrowser(url)
    }
  }

  return (
    <>
      <DropdownMenuGroup>
        <OptionsButtons.PlayNext onClick={() => handlePlayNext()} />
        <OptionsButtons.PlayLast onClick={() => handlePlayLast()} />
        <DropdownMenuSeparator />
        <OptionsButtons.Download onClick={() => handleDownload()} />
      </DropdownMenuGroup>
    </>
  )
}
