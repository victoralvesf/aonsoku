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

export function BigPlayerSettings() {
  const { t } = useTranslation()
  const { useSongColorOnBigPlayer, setUseSongColorOnBigPlayer } = useSongColor()

  return (
    <Root>
      <Header>
        <HeaderTitle>{t('settings.appearance.bigPlayer.group')}</HeaderTitle>
        <HeaderDescription>
          {t('settings.appearance.bigPlayer.description')}
        </HeaderDescription>
      </Header>
      <Content>
        <ContentItem>
          <ContentItemTitle
            info={t('settings.appearance.bigPlayer.colors.info')}
          >
            {t('settings.appearance.bigPlayer.colors.label')}
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
