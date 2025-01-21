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
import { useLyricsSettings } from '@/store/player.store'

export function LyricsSettings() {
  const { t } = useTranslation()
  const { preferSyncedLyrics, setPreferSyncedLyrics } = useLyricsSettings()

  return (
    <Root>
      <Header>
        <HeaderTitle>{t('settings.audio.lyrics.group')}</HeaderTitle>
        <HeaderDescription>
          {t('settings.audio.lyrics.description')}
        </HeaderDescription>
      </Header>
      <Content>
        <ContentItem>
          <ContentItemTitle info={t('settings.audio.lyrics.preferSynced.info')}>
            {t('settings.audio.lyrics.preferSynced.label')}
          </ContentItemTitle>
          <ContentItemForm>
            <Switch
              checked={preferSyncedLyrics}
              onCheckedChange={setPreferSyncedLyrics}
            />
          </ContentItemForm>
        </ContentItem>
      </Content>
      <ContentSeparator />
    </Root>
  )
}
