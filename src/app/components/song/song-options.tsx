import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getDownloadUrl } from '@/api/httpClient'
import { OptionsButtons } from '@/app/components/options/buttons'
import { AddToPlaylistSubMenu } from '@/app/components/song/add-to-playlist-sub-menu'
import {
  DropdownMenuGroup,
  DropdownMenuSeparator,
} from '@/app/components/ui/dropdown-menu'
import { useDownload } from '@/app/hooks/use-download'
import { subsonic } from '@/service/subsonic'
import { usePlayerActions } from '@/store/player.store'
import { ISong } from '@/types/responses/song'
import { queryKeys } from '@/utils/queryKeys'
import { isTauri } from '@/utils/tauriTools'

interface SongOptionsProps {
  song: ISong
}

export function SongOptions({ song }: SongOptionsProps) {
  const { setNextOnQueue, setLastOnQueue } = usePlayerActions()
  const { downloadBrowser, downloadTauri } = useDownload()

  async function handlePlayNext() {
    setNextOnQueue([song])
  }

  async function handlePlayLast() {
    setLastOnQueue([song])
  }

  async function handleDownload() {
    const url = getDownloadUrl(song.id)
    if (isTauri()) {
      downloadTauri(url, song.id)
    } else {
      downloadBrowser(url)
    }
  }

  const queryClient = useQueryClient()

  const updateMutation = useMutation({
    mutationFn: subsonic.playlists.update,
  })

  async function handleAddToPlaylist(id: string) {
    await updateMutation.mutateAsync({
      playlistId: id,
      songIdToAdd: song.id,
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
    await createMutation.mutateAsync({
      name: song.title,
      comment: '',
      isPublic: 'false',
      songIdToAdd: song.id,
    })
  }

  return (
    <>
      <DropdownMenuGroup>
        <OptionsButtons.PlayNext
          onClick={(e) => {
            e.stopPropagation()
            handlePlayNext()
          }}
        />
        <OptionsButtons.PlayLast
          onClick={(e) => {
            e.stopPropagation()
            handlePlayLast()
          }}
        />
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <OptionsButtons.AddToPlaylist>
        <AddToPlaylistSubMenu
          newPlaylistFn={handleCreateNewPlaylist}
          addToPlaylistFn={handleAddToPlaylist}
        />
      </OptionsButtons.AddToPlaylist>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <OptionsButtons.Download
          onClick={(e) => {
            e.stopPropagation()
            handleDownload()
          }}
        />
      </DropdownMenuGroup>
    </>
  )
}
