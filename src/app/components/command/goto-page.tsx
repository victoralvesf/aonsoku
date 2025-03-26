import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { CommandGroup, CommandItem } from '@/app/components/ui/command'
import { ROUTES } from '@/routes/routesList'
import { CommandItemProps } from './command-menu'

const gotoPages = [
  { route: ROUTES.LIBRARY.HOME, label: 'sidebar.home' },
  { route: ROUTES.LIBRARY.ARTISTS, label: 'sidebar.artists' },
  { route: ROUTES.LIBRARY.SONGS, label: 'sidebar.songs' },
  { route: ROUTES.LIBRARY.ALBUMS, label: 'sidebar.albums' },
  { route: ROUTES.LIBRARY.PLAYLISTS, label: 'sidebar.playlists' },
  { route: ROUTES.LIBRARY.RADIOS, label: 'sidebar.radios' },
]

export function CommandGotoPage({ runCommand }: CommandItemProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <CommandGroup heading={t('command.pages')}>
      {gotoPages.map(({ route, label }) => (
        <CommandItem
          key={route}
          onSelect={() => runCommand(() => navigate(route))}
        >
          {t(label)}
        </CommandItem>
      ))}
    </CommandGroup>
  )
}
