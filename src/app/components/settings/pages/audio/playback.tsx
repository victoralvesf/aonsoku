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
import { usePlaybackSettings, usePlayerActions } from '@/store/player.store'

export function PlaybackConfig() {
  const { t } = useTranslation()
  const { transitionMode, setTransitionMode } = usePlaybackSettings()
  const { clearPlayerState } = usePlayerActions()

  return (
    <Root>
      <Header>
        <HeaderTitle>{t('settings.audio.playback.group')}</HeaderTitle>
        <HeaderDescription>
          {t('settings.audio.playback.description')}
        </HeaderDescription>
      </Header>

      <Content>
        <ContentItem>
          <ContentItemTitle info={t('settings.audio.playback.gapless.info')}>
            {t('settings.audio.playback.gapless.label')}
          </ContentItemTitle>
          <ContentItemForm>
            <Switch
              checked={transitionMode !== 'none'}
              onCheckedChange={(checked) => {
                // Clear/unload FIRST so the engine never transiently mounts with
                // the old song (that caused play()->pause() AbortErrors); then
                // switch modes. User picks a fresh song under the new mode.
                clearPlayerState()
                setTransitionMode(checked ? 'gapless' : 'none')
              }}
            />
          </ContentItemForm>
        </ContentItem>
      </Content>

      <ContentSeparator />
    </Root>
  )
}
