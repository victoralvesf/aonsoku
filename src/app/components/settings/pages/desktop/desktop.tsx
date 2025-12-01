import { useTranslation } from 'react-i18next'
import {
  Content,
  ContentItem,
  ContentItemForm,
  ContentItemTitle,
  ContentSeparator,
  Header,
  HeaderDescription,
  HeaderTitle,
  Root,
} from '@/app/components/settings/section'
import { Switch } from '@/app/components/ui/switch'
import { useAppDesktopActions, useAppDesktopData } from '@/store/app.store'

export function DesktopSettings() {
  const { t } = useTranslation()
  const { minimizeToTray } = useAppDesktopData()
  const { setMinimizeToTray } = useAppDesktopActions()

  return (
    <Root>
      <Header>
        <HeaderTitle>{t('settings.desktop.general.group')}</HeaderTitle>
        <HeaderDescription>
          {t('settings.desktop.general.description')}
        </HeaderDescription>
      </Header>
      <Content>
        <ContentItem>
          <ContentItemTitle info={t('settings.desktop.general.tray.info')}>
            {t('settings.desktop.general.tray.label')}
          </ContentItemTitle>
          <ContentItemForm>
            <Switch
              checked={minimizeToTray}
              onCheckedChange={setMinimizeToTray}
            />
          </ContentItemForm>
        </ContentItem>
      </Content>
      <ContentSeparator />
    </Root>
  )
}
