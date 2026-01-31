import { useTranslation } from 'react-i18next'
import {
  Content,
  ContentSeparator,
  Header,
  HeaderDescription,
  HeaderTitle,
  Root,
} from '@/app/components/settings/section'
import { LrcLib } from './lrclib'

export function Services() {
  const { t } = useTranslation()

  return (
    <Root>
      <Header>
        <HeaderTitle>{t('settings.privacy.services.group')}</HeaderTitle>
        <HeaderDescription>
          {t('settings.privacy.services.description')}
        </HeaderDescription>
      </Header>
      <ContentSeparator className="mb-2" />
      <Content>
        <LrcLib />
      </Content>
    </Root>
  )
}
