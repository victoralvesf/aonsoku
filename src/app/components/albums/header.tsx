import { useTranslation } from 'react-i18next'
import { ShadowHeader } from '@/app/components/album/shadow-header'
import { Badge } from '@/app/components/ui/badge'
import { AlbumsFilter } from './filters'

interface AlbumsHeaderProps {
  albumCount: number
}

export function AlbumsHeader({ albumCount }: AlbumsHeaderProps) {
  const { t } = useTranslation()

  return (
    <ShadowHeader>
      <div className="w-full flex justify-between">
        <div className="flex gap-2 items-center">
          <h2 className="text-2xl font-semibold tracking-tight">
            {t('sidebar.albums')}
          </h2>
          <Badge variant="secondary" className="text-foreground/70">
            {albumCount}
          </Badge>
        </div>

        <AlbumsFilter />
      </div>
    </ShadowHeader>
  )
}
