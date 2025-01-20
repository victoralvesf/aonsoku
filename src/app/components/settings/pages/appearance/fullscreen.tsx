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
import { useFullscreenPlayerSettings } from '@/store/player.store'

export function FullscreenSettings() {
  const { t } = useTranslation()
  const { autoFullscreenEnabled, setAutoFullscreenEnabled } =
    useFullscreenPlayerSettings()

  return (
    <Root>
      <Header>
        <HeaderTitle>{t('settings.appearance.general.group')}</HeaderTitle>
        <HeaderDescription>
          {t('settings.appearance.general.description')}
        </HeaderDescription>
      </Header>
      <Content>
        <ContentItem>
          <ContentItemTitle
            info={t('settings.appearance.general.fullscreen.info')}
          >
            {t('settings.appearance.general.fullscreen.label')}
          </ContentItemTitle>
          <ContentItemForm>
            <Switch
              checked={autoFullscreenEnabled}
              onCheckedChange={setAutoFullscreenEnabled}
            />
          </ContentItemForm>
        </ContentItem>
      </Content>
      <ContentSeparator />
    </Root>
  )
}
