import { useTranslation } from 'react-i18next'

export function EmptyAlbumsInfo() {
  const { t } = useTranslation()

  return (
    <div className="text-center max-w-[500px]">
      <h3 className="text-2xl font-semibold tracking-tight">
        {t('album.list.empty.title')}
      </h3>
      <p className="text-sm text-muted-foreground">
        {t('album.list.empty.info')}
      </p>
      <p className="text-sm text-muted-foreground">
        {t('album.list.empty.action')}
      </p>
    </div>
  )
}
