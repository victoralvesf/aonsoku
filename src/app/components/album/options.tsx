import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getDownloadUrl } from '@/api/httpClient'
import { OptionsButtons } from '@/app/components/options/buttons'
import { AddToPlaylistSubMenu } from '@/app/components/song/add-to-playlist'
import {
  DropdownMenuGroup,
  DropdownMenuSeparator,
} from '@/app/components/ui/dropdown-menu'
import { useDownload } from '@/app/hooks/use-download'
import { subsonic } from '@/service/subsonic'
import { usePlayerActions } from '@/store/player.store'
import { SingleAlbum } from '@/types/responses/album'
import { queryKeys } from '@/utils/queryKeys'
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

  const queryClient = useQueryClient()

  const updateMutation = useMutation({
    mutationFn: subsonic.playlists.update,
  })

  async function handleAddToPlaylist(id: string) {
    const albumSongsIds = album.song.map((song) => song.id)

    await updateMutation.mutateAsync({
      playlistId: id,
      songIdToAdd: albumSongsIds,
    })
  }

  const createMutation = useMutation({
    mutationFn: subsonic.playlists.createWithDetails,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.playlist.all],
      })
    },
  })

  async function handleCreateNewPlaylist() {
    const albumSongsIds = album.song.map((song) => song.id)

    await createMutation.mutateAsync({
      name: album.name,
      comment: '',
      isPublic: 'false',
      songIdToAdd: albumSongsIds,
    })
  }

  return (
    <>
      <DropdownMenuGroup>
        <OptionsButtons.PlayNext onClick={() => handlePlayNext()} />
        <OptionsButtons.PlayLast onClick={() => handlePlayLast()} />
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <OptionsButtons.AddToPlaylistOption variant="dropdown">
        <AddToPlaylistSubMenu
          type="dropdown"
          newPlaylistFn={handleCreateNewPlaylist}
          addToPlaylistFn={handleAddToPlaylist}
        />
      </OptionsButtons.AddToPlaylistOption>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <OptionsButtons.Download onClick={() => handleDownload()} />
      </DropdownMenuGroup>
    </>
  )
}
