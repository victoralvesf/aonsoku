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
import { usePrivacySettings } from '@/store/player.store'

const { DISABLE_LRCLIB } = window

export function Services() {
  const { t } = useTranslation()
  const { lrcLibEnabled, setLrcLibEnabled } = usePrivacySettings()

  return (
    <Root>
      <Header>
        <HeaderTitle>{t('settings.privacy.services.group')}</HeaderTitle>
        <HeaderDescription>
          {t('settings.privacy.services.description')}
        </HeaderDescription>
      </Header>
      <Content>
        <ContentItem>
          <ContentItemTitle info={t('settings.privacy.services.lrclib.info')}>
            {t('settings.privacy.services.lrclib.label')}
          </ContentItemTitle>
          <ContentItemForm>
            <Switch
              checked={DISABLE_LRCLIB ? false : lrcLibEnabled}
              onCheckedChange={setLrcLibEnabled}
              disabled={DISABLE_LRCLIB}
            />
          </ContentItemForm>
        </ContentItem>
      </Content>
      <ContentSeparator />
    </Root>
  )
}
