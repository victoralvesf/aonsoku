import { Check, Copy, Eye, EyeOff, Trash2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select'
import { SimpleTooltip } from '@/app/components/ui/simple-tooltip'
import { CheckerboardContainer } from '@/app/components/widget/checkerboard'
import { WidgetToggleRow } from '@/app/components/widget/toggle-row'
import { usePreviewNowPlaying } from '@/app/hooks/use-widget-preview-now-playing'
import { useWidgetActions } from '@/store/widget.store'
import {
  WIDGET_RECOMMENDED_SIZE,
  WidgetIdleBehavior,
  WidgetProfile,
  WidgetTheme,
} from '@/types/widget'
import { WidgetView } from '@/widget/view'

const MASK = '•'.repeat(28)

interface ProfileCardProps {
  profile: WidgetProfile
  port: number
  canRemove: boolean
}

export function ProfileCard({ profile, port, canRemove }: ProfileCardProps) {
  const { t } = useTranslation()
  const { updateProfile, removeProfile } = useWidgetActions()
  const nowPlaying = usePreviewNowPlaying()

  const [urlVisible, setUrlVisible] = useState(false)
  const [copied, setCopied] = useState(false)
  const copyTimeout = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => () => clearTimeout(copyTimeout.current), [])

  const url = `http://127.0.0.1:${port}/widget/profile/${profile.id}`
  const size = WIDGET_RECOMMENDED_SIZE[profile.compact ? 'compact' : 'full']

  async function copyUrl() {
    try {
      await navigator.clipboard.writeText(url)

      setCopied(true)
      clearTimeout(copyTimeout.current)
      copyTimeout.current = setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  return (
    <div className="rounded-lg border border-border p-3 space-y-3">
      <div className="flex items-center gap-2">
        <Input
          value={profile.name}
          onChange={(event) =>
            updateProfile(profile.id, { name: event.target.value })
          }
          className="h-8"
          maxLength={40}
          aria-label={t('settings.widget.profile.name')}
        />
        <SimpleTooltip text={t('settings.widget.profile.remove')} delay={0}>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive-foreground hover:bg-destructive"
            disabled={!canRemove}
            onClick={() => removeProfile(profile.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </SimpleTooltip>
      </div>

      <CheckerboardContainer>
        <WidgetView profile={profile} nowPlaying={nowPlaying} />
      </CheckerboardContainer>

      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        <div className="flex items-center justify-between gap-2 min-h-8">
          <span className="text-sm text-foreground">
            {t('settings.widget.profile.theme.label')}
          </span>
          <Select
            value={profile.theme}
            onValueChange={(value) =>
              updateProfile(profile.id, { theme: value as WidgetTheme })
            }
          >
            <SelectTrigger className="h-8 w-32" hideFocusRing>
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="light">
                {t('settings.widget.profile.theme.light')}
              </SelectItem>
              <SelectItem value="dark">
                {t('settings.widget.profile.theme.dark')}
              </SelectItem>
              <SelectItem value="transparent">
                {t('settings.widget.profile.theme.transparent')}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between gap-2 min-h-8">
          <span className="text-sm text-foreground">
            {t('settings.widget.profile.idle.label')}
          </span>
          <Select
            value={profile.idleBehavior}
            onValueChange={(value) =>
              updateProfile(profile.id, {
                idleBehavior: value as WidgetIdleBehavior,
              })
            }
          >
            <SelectTrigger className="h-8 w-32" hideFocusRing>
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="hide">
                {t('settings.widget.profile.idle.hide')}
              </SelectItem>
              <SelectItem value="show-empty-state">
                {t('settings.widget.profile.idle.empty')}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <WidgetToggleRow
          label={t('settings.widget.profile.compact.label')}
          info={t('settings.widget.profile.compact.info')}
          checked={profile.compact}
          onCheckedChange={(value) =>
            updateProfile(profile.id, { compact: value })
          }
        />
        <WidgetToggleRow
          label={t('settings.widget.profile.showCoverArt')}
          checked={profile.showCoverArt}
          onCheckedChange={(value) =>
            updateProfile(profile.id, { showCoverArt: value })
          }
        />
        <WidgetToggleRow
          label={t('settings.widget.profile.showArtist')}
          checked={profile.showArtist}
          onCheckedChange={(value) =>
            updateProfile(profile.id, { showArtist: value })
          }
        />
        <WidgetToggleRow
          label={t('settings.widget.profile.showAlbum')}
          checked={profile.showAlbum}
          onCheckedChange={(value) =>
            updateProfile(profile.id, { showAlbum: value })
          }
        />
        <WidgetToggleRow
          label={t('settings.widget.profile.showProgressBar')}
          checked={profile.showProgressBar}
          onCheckedChange={(value) =>
            updateProfile(profile.id, { showProgressBar: value })
          }
        />
        <WidgetToggleRow
          label={t('settings.widget.profile.transition.label')}
          info={t('settings.widget.profile.transition.info')}
          checked={profile.transitionOnChange}
          onCheckedChange={(value) =>
            updateProfile(profile.id, { transitionOnChange: value })
          }
        />
      </div>

      <div className="space-y-1.5">
        <span className="text-sm text-foreground">
          {t('settings.widget.profile.url.label')}
        </span>
        <div className="flex items-center gap-2">
          <Input
            value={urlVisible ? url : MASK}
            readOnly
            onFocus={(event) => event.target.select()}
            className="h-8 font-mono text-xs"
          />
          <SimpleTooltip
            text={t(
              urlVisible
                ? 'settings.widget.profile.url.hide'
                : 'settings.widget.profile.url.show',
            )}
            delay={0}
          >
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={() => setUrlVisible((state) => !state)}
            >
              {urlVisible ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </Button>
          </SimpleTooltip>
          <Button
            variant="outline"
            size="sm"
            className="h-8 shrink-0"
            onClick={copyUrl}
          >
            {copied ? (
              <Check className="w-4 h-4 mr-1.5" />
            ) : (
              <Copy className="w-4 h-4 mr-1.5" />
            )}
            {t(
              copied
                ? 'settings.widget.profile.url.copied'
                : 'settings.widget.profile.url.copy',
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          {t('settings.widget.profile.size', {
            width: size.width,
            height: size.height,
          })}
        </p>
        <p className="text-xs text-muted-foreground">
          {t('settings.widget.profile.refreshHint')}
        </p>
      </div>
    </div>
  )
}
