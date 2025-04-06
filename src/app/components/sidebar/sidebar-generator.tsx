import clsx from 'clsx'
import { ListMusicIcon } from 'lucide-react'
import { ElementType, Fragment, memo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import { PlaylistOptions } from '@/app/components/playlist/options'
import { PodcastSidebarItem } from '@/app/components/podcasts/sidebar-item'
import { ContextMenuProvider } from '@/app/components/table/context-menu'
import { Button } from '@/app/components/ui/button'
import { SidebarItems } from '@/app/layout/sidebar'
import { ROUTES } from '@/routes/routesList'
import { useAppStore } from '@/store/app.store'
import { Playlist } from '@/types/responses/playlist'
import { GridViewWrapperType, resetGridClickedItem } from '@/utils/gridTools'

const ListMusic = memo(ListMusicIcon)
const MemoPodcastSidebarItem = memo(PodcastSidebarItem)
const MemoContextMenuProvider = memo(ContextMenuProvider)
const MemoPlaylistOptions = memo(PlaylistOptions)

export interface ISidebarItem {
  id: string
  title: string
  route: string
  icon: ElementType
}

export function SidebarGenerator({ list }: { list: ISidebarItem[] }) {
  const location = useLocation()
  const { t } = useTranslation()
  const hideRadiosSection = useAppStore().pages.hideRadiosSection
  const isPodcastsActive = useAppStore().podcasts.active

  const isActive = useCallback(
    (route: string) => {
      return location.pathname === route
    },
    [location.pathname],
  )

  return (
    <>
      {list.map((item) => {
        // Setting to show/hide Radios/Podcasts section
        if (hideRadiosSection && item.id === SidebarItems.Radios) return null
        if (!isPodcastsActive && item.id === SidebarItems.Podcasts) return null

        if (isPodcastsActive && item.id === SidebarItems.Podcasts) {
          return <MemoPodcastSidebarItem key={item.id} item={item} />
        }

        return (
          <Link
            to={item.route}
            key={item.id}
            tabIndex={-1}
            className={clsx(
              'block',
              isActive(item.route) && 'pointer-events-none',
            )}
            onClick={() => {
              resetGridClickedItem({ name: item.id as GridViewWrapperType })
            }}
          >
            <Button
              variant={isActive(item.route) ? 'secondary' : 'ghost'}
              size="sm"
              className="w-full justify-start"
            >
              <item.icon className="w-4 h-4 mr-2" />
              {t(item.title)}
            </Button>
          </Link>
        )
      })}
    </>
  )
}

export function SidebarPlaylistGenerator({
  playlists,
}: {
  playlists: Playlist[]
}) {
  const location = useLocation()

  const isActive = useCallback(
    (id: string) => {
      return location.pathname === ROUTES.PLAYLIST.PAGE(id)
    },
    [location.pathname],
  )

  return (
    <Fragment>
      {playlists.map((playlist) => (
        <Fragment key={playlist.id}>
          <Link
            to={ROUTES.PLAYLIST.PAGE(playlist.id)}
            className="block"
            tabIndex={-1}
            onClick={(e) => {
              if (isActive(playlist.id)) {
                e.preventDefault()
              }
            }}
          >
            <MemoContextMenuProvider
              options={
                <MemoPlaylistOptions
                  variant="context"
                  playlist={playlist}
                  showPlay={true}
                />
              }
            >
              <Button
                variant={isActive(playlist.id) ? 'secondary' : 'ghost'}
                size="sm"
                className={clsx(
                  'w-full justify-start',
                  isActive(playlist.id) && 'cursor-default hover:bg-accent',
                )}
              >
                <ListMusic className="mr-2 min-h-4 min-w-4 h-4 w-4" />
                <span className="w-full truncate text-left">
                  {playlist.name}
                </span>
              </Button>
            </MemoContextMenuProvider>
          </Link>
        </Fragment>
      ))}
    </Fragment>
  )
}
