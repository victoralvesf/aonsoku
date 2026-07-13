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
import { useAppPages } from '@/store/app.store'

export function HomeContent() {
  const { t } = useTranslation()
  const {
    homeAutoScrollEnabled,
    setHomeAutoScrollEnabled,
    homeLoopEnabled,
    setHomeLoopEnabled,
  } = useAppPages()

  return (
    <Root>
      <Header>
        <HeaderTitle>{t('settings.content.home.group')}</HeaderTitle>
        <HeaderDescription>
          {t('settings.content.home.description')}
        </HeaderDescription>
      </Header>
      <Content>
        <ContentItem>
          <ContentItemTitle info={t('settings.content.home.autoScroll.info')}>
            {t('settings.content.home.autoScroll.label')}
          </ContentItemTitle>
          <ContentItemForm>
            <Switch
              checked={homeAutoScrollEnabled}
              onCheckedChange={setHomeAutoScrollEnabled}
            />
          </ContentItemForm>
        </ContentItem>
        <ContentItem>
          <ContentItemTitle info={t('settings.content.home.loop.info')}>
            {t('settings.content.home.loop.label')}
          </ContentItemTitle>
          <ContentItemForm>
            <Switch
              checked={homeLoopEnabled}
              onCheckedChange={setHomeLoopEnabled}
            />
          </ContentItemForm>
        </ContentItem>
      </Content>
      <ContentSeparator />
    </Root>
  )
}
