import { useTranslation } from 'react-i18next'
import {
  Header,
  HeaderTitle,
  Root,
  HeaderDescription,
  Content,
  ContentItem,
  ContentItemTitle,
  ContentItemForm,
  ContentSeparator,
} from '@/app/components/settings/section'
import { Switch } from '@/app/components/ui/switch'

export function DesktopSettings() {
  const { t } = useTranslation()

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
            // checked={true}
            // onCheckedChange={}
            />
          </ContentItemForm>
        </ContentItem>
      </Content>
      <ContentSeparator />
    </Root>
  )
}
