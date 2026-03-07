import clsx from 'clsx'
import { ListMusic } from 'lucide-react'
import { memo } from 'react'
import { Link } from 'react-router-dom'
import { PlaylistOptions } from '@/app/components/playlist/options'
import { ContextMenuProvider } from '@/app/components/table/context-menu'
import {
  MainSidebarMenuButton,
  MainSidebarMenuItem,
} from '@/app/components/ui/main-sidebar'
import { useRouteIsActive } from '@/app/hooks/use-route-is-active'
import { ROUTES } from '@/routes/routesList'
import { Playlist } from '@/types/responses/playlist'
import { EqualizerBars } from '../icons/equalizer-bars'

const MemoContextMenuProvider = memo(ContextMenuProvider)
const MemoPlaylistOptions = memo(PlaylistOptions)

export function SidebarPlaylistItem({
  playlist,
  isPlaying,
}: {
  playlist: Playlist
  isPlaying: boolean
}) {
  const { isOnPlaylist } = useRouteIsActive()

  return (
    <MainSidebarMenuItem>
      <MemoContextMenuProvider
        options={
          <MemoPlaylistOptions
            variant="context"
            playlist={playlist}
            showPlay={true}
          />
        }
      >
        <MainSidebarMenuButton
          asChild
          className={clsx(
            isOnPlaylist(playlist.id) && 'cursor-default',
            isOnPlaylist(playlist.id) && !isPlaying && 'bg-accent',
            isPlaying && 'text-primary',
          )}
        >
          <Link
            to={ROUTES.PLAYLIST.PAGE(playlist.id)}
            onClick={(e) => {
              if (isOnPlaylist(playlist.id)) {
                e.preventDefault()
              }
            }}
          >
            {isPlaying ? (
              <EqualizerBars className="text-primary" />
            ) : (
              <ListMusic />
            )}
            <span className="truncate">{playlist.name}</span>
          </Link>
        </MainSidebarMenuButton>
      </MemoContextMenuProvider>
    </MainSidebarMenuItem>
  )
}
