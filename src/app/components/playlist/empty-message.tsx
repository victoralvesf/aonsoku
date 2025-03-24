import { useTranslation } from 'react-i18next'

export function EmptyPlaylistsMessage() {
  const { t } = useTranslation()

  return (
    <div className="w-full flex justify-center items-center py-2 px-4 text-sm rounded-md bg-secondary">
      <span>{t('sidebar.emptyPlaylist')}</span>
    </div>
  )
}

export function NoPlaylistsMessage() {
  const { t } = useTranslation()

  return (
    <div className="w-full flex justify-center items-center py-2 px-4 text-sm rounded bg-accent">
      <span>{t('options.playlist.notFound')}</span>
    </div>
  )
}
