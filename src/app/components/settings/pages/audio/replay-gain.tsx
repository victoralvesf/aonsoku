import { Minus, Plus } from 'lucide-react'
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
import { Input } from '@/app/components/ui/input'
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
  const { replayGainEnabled, replayGainType, replayGainPreAmp } =
    useReplayGainState()
  const { setReplayGainEnabled, setReplayGainType, setReplayGainPreAmp } =
    useReplayGainActions()

  // Disabling the Replay Gain feature in the Linux desktop app
  // due to issues with WebKit2GTK
  if (isLinux) return null

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
            />
          </ContentItemForm>
        </ContentItem>

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
              <div className="relative inline-flex h-8 w-full items-center overflow-hidden whitespace-nowrap text-sm shadow-sm shadow-black/5 transition-shadow data-[focus-within]:border-ring data-[disabled]:opacity-50 data-[focus-within]:outline-none data-[focus-within]:ring-[3px] data-[focus-within]:ring-ring/20">
                <Button
                  variant="outline"
                  className="rounded-none rounded-l-md flex aspect-square px-2 h-[inherit] items-center justify-center"
                  onClick={() => setReplayGainPreAmp(replayGainPreAmp - 1)}
                >
                  <Minus size={16} strokeWidth={2} aria-hidden="true" />
                </Button>
                <Input
                  value={replayGainPreAmp}
                  readOnly
                  className="w-full pointer-events-none grow bg-background px-2 h-[inherit] text-center tabular-nums border-x-0 rounded-none text-foreground focus:outline-none"
                />
                <Button
                  variant="outline"
                  className="rounded-none rounded-r-md flex aspect-square px-2 h-[inherit] items-center justify-center"
                  onClick={() => setReplayGainPreAmp(replayGainPreAmp + 1)}
                >
                  <Plus size={16} strokeWidth={2} aria-hidden="true" />
                </Button>
              </div>
            </ContentItemForm>
          </ContentItem>
        )}
      </Content>

      <ContentSeparator />
    </Root>
  )
}
