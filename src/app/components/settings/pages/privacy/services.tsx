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
import { usePrivacySettings } from '@/store/player.store'
import { LyricsSourcePrioritySelect } from '@/app/components/settings/pages/privacy/lyrics-source-priority-select'

export function Services() {
  const { t } = useTranslation()
  const {
    lrcLibEnabled,
    setLrcLibEnabled,
    lrcApiEnabled,
    setLrcApiEnabled,
    lyricsSourcePriority,
    setLyricsSourcePriority,
  } = usePrivacySettings()

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
              checked={lrcLibEnabled}
              onCheckedChange={setLrcLibEnabled}
            />
          </ContentItemForm>
        </ContentItem>
        <ContentItem>
          <ContentItemTitle info={t('settings.privacy.services.lrcapi.info')}>
            {t('settings.privacy.services.lrcapi.label')}
          </ContentItemTitle>
          <ContentItemForm>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
              }}
            >
              <Switch
                checked={lrcApiEnabled}
                onCheckedChange={setLrcApiEnabled}
              />
            </div>
          </ContentItemForm>
        </ContentItem>
        <ContentItem>
          <ContentItemTitle info={t('settings.privacy.services.priority.info')}>
            {t('settings.privacy.services.priority.label')}
          </ContentItemTitle>
          <ContentItemForm>
            <LyricsSourcePrioritySelect
              value={lyricsSourcePriority || ['lrcapi', 'lrclib']}
              onChange={setLyricsSourcePriority}
            />
          </ContentItemForm>
        </ContentItem>
      </Content>
      <ContentSeparator />
    </Root>
  )
}
