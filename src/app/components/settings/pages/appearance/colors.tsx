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

export function ColorSettings() {
  const { t } = useTranslation()
  const {
    useSongColorOnQueue,
    setUseSongColorOnQueue,
    useSongColorOnBigPlayer,
    setUseSongColorOnBigPlayer,
  } = useSongColor()

  return (
    <Root>
      <Header>
        <HeaderTitle>{t('settings.appearance.colors.group')}</HeaderTitle>
        <HeaderDescription>
          {t('settings.appearance.colors.description')}
        </HeaderDescription>
      </Header>
      <Content>
        <ContentItem>
          <ContentItemTitle>
            {t('settings.appearance.colors.queue.label')}
          </ContentItemTitle>
          <ContentItemForm>
            <Switch
              checked={useSongColorOnQueue}
              onCheckedChange={setUseSongColorOnQueue}
            />
          </ContentItemForm>
        </ContentItem>

        <ContentItem>
          <ContentItemTitle>
            {t('settings.appearance.colors.bigPlayer.label')}
          </ContentItemTitle>
          <ContentItemForm>
            <Switch
              checked={useSongColorOnBigPlayer}
              onCheckedChange={setUseSongColorOnBigPlayer}
            />
          </ContentItemForm>
        </ContentItem>
      </Content>
      <ContentSeparator />
    </Root>
  )
}
