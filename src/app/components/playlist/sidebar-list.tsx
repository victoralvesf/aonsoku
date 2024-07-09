import { ReactNode, useEffect } from 'react'
import { Fragment } from 'react/jsx-runtime'
import { useTranslation } from 'react-i18next'
import { SidebarPlaylistButtons } from '@/app/components/playlist/sidebar-buttons'
import { SidebarPlaylistGenerator } from '@/app/components/sidebar-generator'
import { ScrollArea } from '@/app/components/ui/scroll-area'
import { usePlaylists } from '@/store/playlists.store'

export function SidebarPlaylists() {
  const { t } = useTranslation()
  const { playlists, fetchPlaylists } = usePlaylists()

  useEffect(() => {
    fetchPlaylists()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex flex-col flex-grow pl-4 pt-0 overflow-y-auto">
      <div className="pr-2">
        <SectionTitle>
          <Fragment>
            {t('sidebar.playlists')}
            <SidebarPlaylistButtons />
          </Fragment>
        </SectionTitle>
      </div>
      <div className="flex flex-col overflow-y-auto">
        <ScrollArea id="playlists" className="pr-4 pb-2">
          {playlists.length > 0 ? (
            <SidebarPlaylistGenerator playlists={playlists} />
          ) : (
            <span className="w-full truncate text-left px-3 pt-2 text-sm">
              {t('sidebar.emptyPlaylist')}
            </span>
          )}
        </ScrollArea>
      </div>
    </div>
  )
}

export function SidebarSection({ children }: { children: ReactNode }) {
  return <div className="px-4 py-2 pt-0">{children}</div>
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight flex justify-between items-center">
      {children}
    </h2>
  )
}
