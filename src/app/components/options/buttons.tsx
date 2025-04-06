import omit from 'lodash/omit'
import {
  CheckIcon,
  DownloadIcon,
  Info,
  Pencil,
  PlayIcon,
  PlusCircle,
  PlusIcon,
  PlusSquare,
  PodcastIcon,
  Trash,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { ContextMenuItem } from '@/app/components/ui/context-menu'
import { DropdownMenuItem } from '@/app/components/ui/dropdown-menu'
import { MenuItemFactory } from './menu-item-factory'
import { SubMenuFactory } from './sub-menu-factory'

type DropdownMenuItemProps = React.ComponentPropsWithoutRef<
  typeof DropdownMenuItem | typeof ContextMenuItem
> & {
  variant?: 'dropdown' | 'context'
}

function Play({ variant = 'dropdown', ...props }: DropdownMenuItemProps) {
  const { t } = useTranslation()

  return (
    <MenuItemFactory
      variant={variant}
      icon={<PlayIcon className="mr-2 h-4 w-4 fill-foreground" />}
      label={t('options.play')}
      {...props}
    />
  )
}

function PlayNext({ variant = 'dropdown', ...props }: DropdownMenuItemProps) {
  const { t } = useTranslation()

  return (
    <MenuItemFactory
      variant={variant}
      icon={<PlusCircle className="mr-2 h-4 w-4" />}
      label={t('options.playNext')}
      {...props}
    />
  )
}

function PlayLast({ variant = 'dropdown', ...props }: DropdownMenuItemProps) {
  const { t } = useTranslation()

  return (
    <MenuItemFactory
      variant={variant}
      icon={<PlusSquare className="mr-2 h-4 w-4" />}
      label={t('options.addLast')}
      {...props}
    />
  )
}

function Download({ variant = 'dropdown', ...props }: DropdownMenuItemProps) {
  const { t } = useTranslation()

  return (
    <MenuItemFactory
      variant={variant}
      icon={<DownloadIcon className="mr-2 h-4 w-4" />}
      label={t('options.download')}
      {...props}
    />
  )
}

function EditPlaylist({
  variant = 'dropdown',
  ...props
}: DropdownMenuItemProps) {
  const { t } = useTranslation()

  return (
    <MenuItemFactory
      variant={variant}
      icon={<Pencil className="mr-2 h-4 w-4" />}
      label={t('options.playlist.edit')}
      {...props}
    />
  )
}

function RemovePlaylist({
  variant = 'dropdown',
  ...props
}: DropdownMenuItemProps) {
  const { t } = useTranslation()

  return (
    <MenuItemFactory
      variant={variant}
      icon={<Trash className="mr-2 h-4 w-4 fill-red-300 text-red-500" />}
      label={t('options.playlist.delete')}
      {...props}
    />
  )
}

export function AddToPlaylistOption({
  variant = 'dropdown',
  children,
  ...props
}: DropdownMenuItemProps) {
  const { t } = useTranslation()
  const propsWithoutChildren = omit(props, 'children')

  return (
    <SubMenuFactory
      variant={variant}
      icon={<PlusIcon className="mr-2 h-4 w-4" />}
      label={t('options.playlist.add')}
      {...propsWithoutChildren}
    >
      {children}
    </SubMenuFactory>
  )
}

function RemoveFromPlaylist({
  variant = 'dropdown',
  ...props
}: DropdownMenuItemProps) {
  const { t } = useTranslation()

  return (
    <MenuItemFactory
      variant={variant}
      icon={<Trash className="mr-2 h-4 w-4 fill-red-300 text-red-500" />}
      label={t('options.playlist.removeSong')}
      {...props}
    />
  )
}

function SongInfo({ variant = 'dropdown', ...props }: DropdownMenuItemProps) {
  const { t } = useTranslation()

  return (
    <MenuItemFactory
      variant={variant}
      icon={<Info className="mr-2 h-4 w-4" />}
      label={t('options.info')}
      {...props}
    />
  )
}

function MarkAsPlayed({
  variant = 'dropdown',
  ...props
}: DropdownMenuItemProps) {
  const { t } = useTranslation()

  return (
    <MenuItemFactory
      variant={variant}
      icon={<CheckIcon className="mr-2 h-4 w-4" />}
      label={t('options.markAsPlayed')}
      {...props}
    />
  )
}

type GotoPodcastProps = DropdownMenuItemProps & {
  type: 'podcast' | 'episode'
}

function GotoPodcast({
  variant = 'dropdown',
  type = 'podcast',
  ...props
}: GotoPodcastProps) {
  const { t } = useTranslation()

  const label = t(`options.goto.${type}`)

  return (
    <MenuItemFactory
      variant={variant}
      icon={<PodcastIcon className="mr-2 h-4 w-4" />}
      label={label}
      {...props}
    />
  )
}

export const OptionsButtons = {
  Play,
  PlayNext,
  PlayLast,
  Download,
  AddToPlaylistOption,
  EditPlaylist,
  RemovePlaylist,
  RemoveFromPlaylist,
  SongInfo,
  MarkAsPlayed,
  GotoPodcast,
}
