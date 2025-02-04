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
import {
  useFullscreenPlayerSettings,
  useMinimizeToSystemTraySettings,
} from '@/store/player.store'
import { isTauri } from '@/utils/tauriTools'

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
        <MinimizeToSystemTraySettings />
      </Content>
      <ContentSeparator />
    </Root>
  )
}

function MinimizeToSystemTraySettings() {
  const { t } = useTranslation()
  const { minimizeToSystemTrayEnabled, setMinimizeToSystemTrayEnabled } =
    useMinimizeToSystemTraySettings()

  if (!isTauri()) return null

  return (
    <ContentItem>
      <ContentItemTitle
        info={t('settings.appearance.general.minimizeToSystemTray.info')}
      >
        {t('settings.appearance.general.minimizeToSystemTray.label')}
      </ContentItemTitle>
      <ContentItemForm>
        <Switch
          checked={minimizeToSystemTrayEnabled}
          onCheckedChange={setMinimizeToSystemTrayEnabled}
        />
      </ContentItemForm>
    </ContentItem>
  )
}
