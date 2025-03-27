import { useTranslation } from 'react-i18next'
import { EmptyWrapper } from '@/app/components/albums/empty-wrapper'
import ListWrapper from '@/app/components/list-wrapper'
import { Button } from '@/app/components/ui/button'
import { usePlaylists } from '@/store/playlists.store'

export function EmptyPlaylistsPage() {
  const { t } = useTranslation()
  const { setPlaylistDialogState } = usePlaylists()

  return (
    <ListWrapper className="pt-[--shadow-header-distance] h-full">
      <EmptyWrapper>
        <div className="text-center max-w-[500px]">
          <h3 className="text-2xl font-semibold tracking-tight">
            {t('sidebar.emptyPlaylist')}
          </h3>

          <Button
            size="sm"
            variant="default"
            className="mt-4"
            onClick={() => setPlaylistDialogState(true)}
          >
            <span>{t('playlist.form.create.title')}</span>
          </Button>
        </div>
      </EmptyWrapper>
    </ListWrapper>
  )
}
