import { getDownloadUrl } from '@/api/httpClient'
import { OptionsButtons } from '@/app/components/options/buttons'
import {
  DropdownMenuGroup,
  DropdownMenuSeparator,
} from '@/app/components/ui/dropdown-menu'
import { useDownload } from '@/app/hooks/use-download'
import { usePlayerActions } from '@/store/player.store'
import { SingleAlbum } from '@/types/responses/album'
import { isTauri } from '@/utils/tauriTools'

interface AlbumOptionsProps {
  album: SingleAlbum
}

export function AlbumOptions({ album }: AlbumOptionsProps) {
  const { setNextOnQueue, setLastOnQueue } = usePlayerActions()
  const { downloadBrowser, downloadTauri } = useDownload()

  async function handlePlayNext() {
    setNextOnQueue(album.song)
  }

  async function handlePlayLast() {
    setLastOnQueue(album.song)
  }

  async function handleDownload() {
    const url = getDownloadUrl(album.id)
    if (isTauri()) {
      downloadTauri(url, album.id)
    } else {
      downloadBrowser(url)
    }
  }

  return (
    <>
      <DropdownMenuGroup>
        <OptionsButtons.PlayNext onClick={() => handlePlayNext()} />
        <OptionsButtons.PlayLast onClick={() => handlePlayLast()} />
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <OptionsButtons.Download onClick={() => handleDownload()} />
      </DropdownMenuGroup>
    </>
  )
}
