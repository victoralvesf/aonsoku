import { useTranslation } from 'react-i18next'
import { CommandGroup, CommandItem } from '@/app/components/ui/command'
import { usePlaylists } from '@/store/playlists.store'
import { CustomCommandItem } from './command-item'
import { CommandItemProps } from './command-menu'

export type CommandPages = 'HOME' | 'GOTO' | 'THEME' | 'PLAYLISTS' | 'SERVER'

type HomeProps = CommandItemProps & {
  pages: CommandPages[]
  setPages: (value: CommandPages[]) => void
}

export function CommandHome({ pages, setPages, runCommand }: HomeProps) {
  const { t } = useTranslation()
  const { setPlaylistDialogState } = usePlaylists()

  return (
    <CommandGroup heading={t('command.commands.heading')}>
      <CommandItem onSelect={() => setPages([...pages, 'GOTO'])}>
        <CustomCommandItem variant="GotoPage">
          {t('command.commands.pages')}
        </CustomCommandItem>
      </CommandItem>
      <CommandItem onSelect={() => setPages([...pages, 'THEME'])}>
        <CustomCommandItem variant="ChangeTheme">
          {t('command.commands.theme')}
        </CustomCommandItem>
      </CommandItem>
      <CommandItem onSelect={() => setPages([...pages, 'PLAYLISTS'])}>
        <CustomCommandItem variant="Playlists">
          {t('sidebar.playlists')}
        </CustomCommandItem>
      </CommandItem>
      <CommandItem
        onSelect={() => runCommand(() => setPlaylistDialogState(true))}
      >
        <CustomCommandItem variant="CreatePlaylist">
          {t('playlist.form.create.title')}
        </CustomCommandItem>
      </CommandItem>
      <CommandItem onSelect={async () => setPages([...pages, 'SERVER'])}>
        <CustomCommandItem variant="ServerManagement">
          {t('server.management')}
        </CustomCommandItem>
      </CommandItem>
    </CommandGroup>
  )
}
