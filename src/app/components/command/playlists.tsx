import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { CommandGroup, CommandItem } from '@/app/components/ui/command'
import { ROUTES } from '@/routes/routesList'
import { subsonic } from '@/service/subsonic'
import { queryKeys } from '@/utils/queryKeys'
import { CommandItemProps } from './command-menu'

export function CommandPlaylists({ runCommand }: CommandItemProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const { data: playlists } = useQuery({
    queryKey: [queryKeys.playlist.all],
    queryFn: subsonic.playlists.getAll,
  })

  return (
    <CommandGroup heading={t('sidebar.playlists')}>
      {playlists &&
        playlists.length > 0 &&
        playlists.map((playlist) => (
          <CommandItem
            key={playlist.id}
            value={playlist.name}
            className="truncate"
            onSelect={() =>
              runCommand(() => navigate(ROUTES.PLAYLIST.PAGE(playlist.id)))
            }
          >
            <p className="truncate">{playlist.name}</p>
          </CommandItem>
        ))}
    </CommandGroup>
  )
}
