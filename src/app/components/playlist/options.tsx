import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/app/components/ui/dropdown-menu"
import { PlaylistWithEntries } from "@/types/responses/playlist"
import { Download, Pencil, PlusCircle, PlusSquare, Trash } from "lucide-react"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"

interface PlaylistOptionsProps {
  playlist: PlaylistWithEntries
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
  const memoizedPlaylist = useMemo(() => playlist, [playlist])
  const { t } = useTranslation()

  return (
    <>
      <DropdownMenuGroup>
        <DropdownMenuItem disabled={disablePlayNext}>
          <PlusCircle className="mr-2 h-4 w-4" />
          <span>
            {t('options.playNext')}
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem disabled={disableAddLast}>
          <PlusSquare className="mr-2 h-4 w-4" />
          <span>
            {t('options.addLast')}
          </span>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem disabled={disableDownload}>
          <Download className="mr-2 h-4 w-4" />
          <span>
            {t('options.download')}
          </span>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem disabled={disableEdit}>
          <Pencil className="mr-2 h-4 w-4" />
          <span>
            {t('options.playlist.edit')}
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onRemovePlaylist()} disabled={disableDelete}>
          <Trash className="mr-2 h-4 w-4 fill-red-300 text-red-500" />
          <span className="text-red-500">
            {t('options.playlist.delete')}
          </span>
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </>
  )
}