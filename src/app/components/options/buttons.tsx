import omit from 'lodash/omit'
import {
  DownloadIcon,
  Info,
  Pencil,
  PlusCircle,
  PlusIcon,
  PlusSquare,
  Trash,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
} from '@/app/components/ui/dropdown-menu'

type DropdownMenuItemProps = React.ComponentPropsWithoutRef<
  typeof DropdownMenuItem
>

function PlayNext(props: DropdownMenuItemProps) {
  const { t } = useTranslation()

  return (
    <DropdownMenuItem {...props}>
      <PlusCircle className="mr-2 h-4 w-4" />
      <span>{t('options.playNext')}</span>
    </DropdownMenuItem>
  )
}

function PlayLast(props: DropdownMenuItemProps) {
  const { t } = useTranslation()

  return (
    <DropdownMenuItem {...props}>
      <PlusSquare className="mr-2 h-4 w-4" />
      <span>{t('options.addLast')}</span>
    </DropdownMenuItem>
  )
}

function Download(props: DropdownMenuItemProps) {
  const { t } = useTranslation()

  return (
    <DropdownMenuItem {...props}>
      <DownloadIcon className="mr-2 h-4 w-4" />
      <span>{t('options.download')}</span>
    </DropdownMenuItem>
  )
}

function EditPlaylist(props: DropdownMenuItemProps) {
  const { t } = useTranslation()

  return (
    <DropdownMenuItem {...props}>
      <Pencil className="mr-2 h-4 w-4" />
      <span>{t('options.playlist.edit')}</span>
    </DropdownMenuItem>
  )
}

function RemovePlaylist(props: DropdownMenuItemProps) {
  const { t } = useTranslation()

  return (
    <DropdownMenuItem {...props}>
      <Trash className="mr-2 h-4 w-4 fill-red-300 text-red-500" />
      <span className="text-red-500">{t('options.playlist.delete')}</span>
    </DropdownMenuItem>
  )
}

function AddToPlaylist(props: DropdownMenuItemProps) {
  const { t } = useTranslation()
  const propsWithoutChildren = omit(props, 'children')

  return (
    <DropdownMenuSub {...propsWithoutChildren}>
      <DropdownMenuSubTrigger>
        <PlusIcon className="mr-2 h-4 w-4" />
        <span className="mr-4">{t('options.playlist.add')}</span>
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <>{props.children}</>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  )
}

function RemoveFromPlaylist(props: DropdownMenuItemProps) {
  const { t } = useTranslation()

  return (
    <DropdownMenuItem {...props}>
      <Trash className="mr-2 h-4 w-4 fill-red-300 text-red-500" />
      <span className="text-red-500">{t('options.playlist.removeSong')}</span>
    </DropdownMenuItem>
  )
}

function SongInfo(props: DropdownMenuItemProps) {
  const { t } = useTranslation()

  return (
    <DropdownMenuItem {...props}>
      <Info className="mr-2 h-4 w-4" />
      <span>{t('options.info')}</span>
    </DropdownMenuItem>
  )
}

export const OptionsButtons = {
  PlayNext,
  PlayLast,
  Download,
  AddToPlaylist,
  EditPlaylist,
  RemovePlaylist,
  RemoveFromPlaylist,
  SongInfo,
}
