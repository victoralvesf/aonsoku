import { useQuery } from '@tanstack/react-query'
import { ComponentPropsWithoutRef } from 'react'
import { useTranslation } from 'react-i18next'
import { SidebarPlaylistButtons } from '@/app/components/playlist/sidebar-buttons'
import { SidebarPlaylistGenerator } from '@/app/components/sidebar/sidebar-generator'
import { ScrollArea } from '@/app/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { subsonic } from '@/service/subsonic'
import { queryKeys } from '@/utils/queryKeys'
import { EmptyPlaylistsMessage } from './empty-message'

export function SidebarPlaylists() {
  const { t } = useTranslation()

  const { data: playlists } = useQuery({
    queryKey: [queryKeys.playlist.all],
    queryFn: subsonic.playlists.getAll,
  })

  return (
    <div className="flex flex-col flex-grow overflow-y-auto">
      <div className="flex justify-between items-center px-4 pb-2">
        <SectionTitle className="mb-0">{t('sidebar.playlists')}</SectionTitle>
        <SidebarPlaylistButtons />
      </div>
      <div className="flex flex-col overflow-y-auto">
        <ScrollArea id="playlists" className="px-4 pb-2">
          {playlists !== undefined && playlists.length > 0 ? (
            <SidebarPlaylistGenerator playlists={playlists} />
          ) : (
            <EmptyPlaylistsMessage />
          )}
        </ScrollArea>
      </div>
    </div>
  )
}

export function SidebarSection({
  className,
  ...props
}: ComponentPropsWithoutRef<'div'>) {
  return <div className={cn('px-4 py-2 pt-0', className)} {...props} />
}

export function SectionTitle({
  className,
  ...props
}: ComponentPropsWithoutRef<'h2'>) {
  return (
    <h2
      className={cn(
        'mb-2 px-2 text-lg font-semibold tracking-tight flex justify-between items-center',
        className,
      )}
      {...props}
    />
  )
}
