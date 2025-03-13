import { useTranslation } from 'react-i18next'
import {
  Content,
  ContentItem,
  ContentItemForm,
  ContentItemTitle,
  ContentSeparator,
  Header,
  HeaderTitle,
  HeaderDescription,
  Root,
} from '@/app/components/settings/section'
import { Switch } from '@/app/components/ui/switch'
import { useSongColor } from '@/store/player.store'

export function QueueSettings() {
  const { t } = useTranslation()
  const { useSongColorOnQueue, setUseSongColorOnQueue } = useSongColor()

  return (
    <Root>
      <Header>
        <HeaderTitle>{t('settings.appearance.queue.group')}</HeaderTitle>
        <HeaderDescription>
          {t('settings.appearance.queue.description')}
        </HeaderDescription>
      </Header>
      <Content>
        <ContentItem>
          <ContentItemTitle info={t('settings.appearance.queue.colors.info')}>
            {t('settings.appearance.queue.colors.label')}
          </ContentItemTitle>
          <ContentItemForm>
            <Switch
              checked={useSongColorOnQueue}
              onCheckedChange={setUseSongColorOnQueue}
            />
          </ContentItemForm>
        </ContentItem>
      </Content>
      <ContentSeparator />
    </Root>
  )
}
