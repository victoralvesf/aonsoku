import { OptionsButtons } from '@/app/components/options/buttons'
import {
  DropdownMenuGroup,
  DropdownMenuSeparator,
} from '@/app/components/ui/dropdown-menu'
import { usePlayerActions } from '@/store/player.store'
import { SingleAlbum } from '@/types/responses/album'

interface AlbumOptionsProps {
  album: SingleAlbum
}

export function AlbumOptions({ album }: AlbumOptionsProps) {
  const { setNextOnQueue, setLastOnQueue } = usePlayerActions()

  async function handlePlayNext() {
    setNextOnQueue(album.song)
  }

  async function handlePlayLast() {
    setLastOnQueue(album.song)
  }

  return (
    <>
      <DropdownMenuGroup>
        <OptionsButtons.PlayNext onClick={() => handlePlayNext()} />
        <OptionsButtons.PlayLast onClick={() => handlePlayLast()} />
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <OptionsButtons.Download />
      </DropdownMenuGroup>
    </>
  )
}
