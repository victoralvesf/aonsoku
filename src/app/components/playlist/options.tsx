import { Download, Pencil, PlusCircle, PlusSquare, Trash } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/app/components/ui/dropdown-menu'
import { subsonic } from '@/service/subsonic'
import { usePlayerActions } from '@/store/player.store'
import { usePlaylists } from '@/store/playlists.store'
import { Playlist, PlaylistWithEntries } from '@/types/responses/playlist'
import { ISong } from '@/types/responses/song'

interface PlaylistOptionsProps {
  playlist: PlaylistWithEntries | Playlist
  onRemovePlaylist: () => void
  disablePlayNext?: boolean
  disableAddLast?: boolean
  disableDownload?: boolean
  disableEdit?: boolean
  disableDelete?: boolean
}

export function PlaylistOptions({
  playlist,
  onRemovePlaylist,
  disablePlayNext = false,
  disableAddLast = false,
  disableDownload = false,
  disableEdit = false,
  disableDelete = false,
}: PlaylistOptionsProps) {
  const { t } = useTranslation()
  const { setPlaylistDialogState, setData } = usePlaylists()
  const { setNextOnQueue, setLastOnQueue } = usePlayerActions()

  function handleEdit() {
    setData({
      id: playlist.id,
      name: playlist.name,
      comment: playlist.comment,
      public: playlist.public,
    })
    setPlaylistDialogState(true)
  }

  async function getSongsToQueue(callback: (songs: ISong[]) => void) {
    const playlistWithEntries = await subsonic.playlists.getOne(playlist.id)
    if (!playlistWithEntries) return

    callback(playlistWithEntries.entry)
  }

  async function handlePlayNext() {
    if ('entry' in playlist) {
      setNextOnQueue(playlist.entry)
    } else {
      await getSongsToQueue((songs) => setNextOnQueue(songs))
    }
  }

  async function handlePlayLast() {
    if ('entry' in playlist) {
      setLastOnQueue(playlist.entry)
    } else {
      await getSongsToQueue((songs) => setLastOnQueue(songs))
    }
  }

  return (
    <>
      <DropdownMenuGroup>
        <DropdownMenuItem
          disabled={disablePlayNext}
          onClick={() => handlePlayNext()}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          <span>{t('options.playNext')}</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={disableAddLast}
          onClick={() => handlePlayLast()}
        >
          <PlusSquare className="mr-2 h-4 w-4" />
          <span>{t('options.addLast')}</span>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem disabled={disableDownload}>
          <Download className="mr-2 h-4 w-4" />
          <span>{t('options.download')}</span>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem onClick={() => handleEdit()} disabled={disableEdit}>
          <Pencil className="mr-2 h-4 w-4" />
          <span>{t('options.playlist.edit')}</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onRemovePlaylist()}
          disabled={disableDelete}
        >
          <Trash className="mr-2 h-4 w-4 fill-red-300 text-red-500" />
          <span className="text-red-500">{t('options.playlist.delete')}</span>
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </>
  )
}
