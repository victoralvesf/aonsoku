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
import { useAppPages } from '@/store/app.store'

const hideRadiosSectionConfig = window.HIDE_RADIOS_SECTION ?? false

export function SidebarContent() {
  const { t } = useTranslation()
  const { hideRadiosSection, setHideRadiosSection } = useAppPages()

  return (
    <Root>
      <Header>
        <HeaderTitle>{t('settings.content.sidebar.group')}</HeaderTitle>
        <HeaderDescription>
          {t('settings.content.sidebar.description')}
        </HeaderDescription>
      </Header>
      <Content>
        <ContentItem>
          <ContentItemTitle>
            {t('settings.content.sidebar.radios.section')}
          </ContentItemTitle>
          <ContentItemForm>
            <Switch
              checked={hideRadiosSection}
              onCheckedChange={setHideRadiosSection}
              disabled={hideRadiosSectionConfig}
            />
          </ContentItemForm>
        </ContentItem>
      </Content>
      <ContentSeparator />
    </Root>
  )
}
