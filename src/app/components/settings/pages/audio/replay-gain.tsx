import { useTranslation } from 'react-i18next'
import {
  Root,
  Header,
  HeaderTitle,
  HeaderDescription,
  Content,
  ContentItem,
  ContentItemTitle,
  ContentItemForm,
  ContentSeparator,
} from '@/app/components/settings/section'
import { Button } from '@/app/components/ui/button'
import { NumericInput } from '@/app/components/ui/numeric-input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select'
import { Switch } from '@/app/components/ui/switch'
import { useReplayGainActions, useReplayGainState } from '@/store/player.store'
import { ReplayGainType } from '@/types/playerContext'
import { isLinux } from '@/utils/osType'

const replayGainModes: ReplayGainType[] = ['track', 'album']

export function ReplayGainConfig() {
  const { t } = useTranslation()
  const {
    replayGainEnabled,
    replayGainType,
    replayGainPreAmp,
    replayGainDefaultGain,
    replayGainError,
  } = useReplayGainState()
  const {
    setReplayGainEnabled,
    setReplayGainType,
    setReplayGainPreAmp,
    setReplayGainDefaultGain,
    setReplayGainError,
  } = useReplayGainActions()

  // Disabling the Replay Gain feature in the Linux desktop app
  // due to issues with WebKit2GTK
  if (isLinux) return null

  const handleResetError = () => {
    setReplayGainError(false)
    setReplayGainEnabled(true)
    window.location.reload()
  }

  return (
    <Root>
      <Header>
        <HeaderTitle>{t('settings.audio.replayGain.group')}</HeaderTitle>
        <HeaderDescription>
          {t('settings.audio.replayGain.description')}
        </HeaderDescription>
      </Header>

      <Content>
        <ContentItem>
          <ContentItemTitle>
            {t('settings.audio.replayGain.enabled')}
          </ContentItemTitle>
          <ContentItemForm>
            <Switch
              checked={replayGainEnabled}
              onCheckedChange={(checked) => setReplayGainEnabled(checked)}
              disabled={replayGainError}
            />
          </ContentItemForm>
        </ContentItem>

        {replayGainError && (
          <ContentItem>
            <ContentItemTitle className="text-xs text-muted-foreground text-balance">
              {t('settings.audio.replayGain.error.message')}
            </ContentItemTitle>
            <ContentItemForm>
              <Button
                size="sm"
                variant="destructive"
                className="h-8"
                onClick={handleResetError}
              >
                {t('settings.audio.replayGain.error.button')}
              </Button>
            </ContentItemForm>
          </ContentItem>
        )}

        {replayGainEnabled && (
          <ContentItem>
            <ContentItemTitle>
              {t('settings.audio.replayGain.mode.label')}
            </ContentItemTitle>
            <ContentItemForm>
              <Select
                value={replayGainType}
                onValueChange={(value) =>
                  setReplayGainType(value as ReplayGainType)
                }
              >
                <SelectTrigger className="h-8 ring-offset-transparent focus:ring-0 focus:ring-transparent text-left">
                  <SelectValue>
                    <span className="text-sm text-foreground">
                      {t('settings.audio.replayGain.mode.' + replayGainType)}
                    </span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent align="end">
                  <SelectGroup>
                    {replayGainModes.map((replayGainMode) => (
                      <SelectItem key={replayGainMode} value={replayGainMode}>
                        <span>
                          {t(
                            'settings.audio.replayGain.mode.' + replayGainMode,
                          )}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </ContentItemForm>
          </ContentItem>
        )}

        {replayGainEnabled && (
          <ContentItem>
            <ContentItemTitle>
              {t('settings.audio.replayGain.preAmp')}
            </ContentItemTitle>
            <ContentItemForm>
              <NumericInput
                value={replayGainPreAmp}
                onChange={setReplayGainPreAmp}
                min={-15}
                max={15}
              />
            </ContentItemForm>
          </ContentItem>
        )}

        {replayGainEnabled && (
          <ContentItem>
            <ContentItemTitle
              info={t('settings.audio.replayGain.defaultGain.info')}
            >
              {t('settings.audio.replayGain.defaultGain.label')}
            </ContentItemTitle>
            <ContentItemForm>
              <NumericInput
                value={replayGainDefaultGain}
                onChange={setReplayGainDefaultGain}
                min={-10}
                max={-1}
              />
            </ContentItemForm>
          </ContentItem>
        )}
      </Content>

      <ContentSeparator />
    </Root>
  )
}
