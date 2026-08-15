import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDebouncedCallback } from 'use-debounce'
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
import { Input } from '@/app/components/ui/input'
import { Switch } from '@/app/components/ui/switch'
import {
  useWidgetActions,
  useWidgetData,
  useWidgetServerStatus,
} from '@/store/widget.store'
import {
  WIDGET_BLOCKED_PORTS,
  WIDGET_MAX_PORT,
  WIDGET_MIN_PORT,
} from '@/types/widget'

type PortErrorKey = 'invalid' | 'range' | 'blocked' | null

function validatePort(value: string): PortErrorKey {
  const port = Number(value)

  if (!value.trim() || !Number.isInteger(port)) return 'invalid'
  if (port < WIDGET_MIN_PORT || port > WIDGET_MAX_PORT) return 'range'
  if (WIDGET_BLOCKED_PORTS.includes(port)) return 'blocked'

  return null
}

export function WidgetServerSettings() {
  const { t } = useTranslation()
  const { enabled, port, profiles } = useWidgetData()
  const { setEnabled, setPort, addProfile } = useWidgetActions()
  const status = useWidgetServerStatus()

  const [portInput, setPortInput] = useState(port.toString())
  const [portError, setPortError] = useState<PortErrorKey>(null)

  useEffect(() => {
    setPortInput(port.toString())
  }, [port])

  const commitPort = useDebouncedCallback((value: string) => {
    if (validatePort(value)) return

    setPort(Number(value))
  }, 600)

  function handlePortChange(value: string) {
    setPortInput(value)
    setPortError(validatePort(value))
    commitPort(value)
  }

  function handleToggle(value: boolean) {
    // There is always at least one URL to copy once the server is on.
    if (value && profiles.length === 0) {
      addProfile(t('settings.widget.profiles.defaultName'))
    }

    setEnabled(value)
  }

  function statusMessage() {
    if (!enabled) return t('settings.widget.server.status.stopped')

    if (status.status === 'running') {
      return t('settings.widget.server.status.running', { port: status.port })
    }

    if (status.status === 'error') {
      if (status.code === 'port-in-use') {
        return t('settings.widget.server.status.portInUse', {
          port: status.port,
        })
      }

      return t('settings.widget.server.status.unknown', {
        message: status.message,
      })
    }

    return t('settings.widget.server.status.starting')
  }

  const hasError = enabled && status.status === 'error'

  return (
    <Root>
      <Header>
        <HeaderTitle>{t('settings.widget.server.group')}</HeaderTitle>
        <HeaderDescription>
          {t('settings.widget.server.description')}
        </HeaderDescription>
      </Header>
      <Content>
        <ContentItem>
          <ContentItemTitle info={t('settings.widget.server.enabled.info')}>
            {t('settings.widget.server.enabled.label')}
          </ContentItemTitle>
          <ContentItemForm>
            <Switch checked={enabled} onCheckedChange={handleToggle} />
          </ContentItemForm>
        </ContentItem>

        <ContentItem>
          <ContentItemTitle info={t('settings.widget.server.port.info')}>
            {t('settings.widget.server.port.label')}
            {portError && (
              <p className="text-destructive text-xs mt-1">
                {t(`settings.widget.server.port.errors.${portError}`, {
                  min: WIDGET_MIN_PORT,
                  max: WIDGET_MAX_PORT,
                  blocked: WIDGET_BLOCKED_PORTS.join(', '),
                })}
              </p>
            )}
          </ContentItemTitle>
          <ContentItemForm>
            <Input
              value={portInput}
              inputMode="numeric"
              onChange={(event) => handlePortChange(event.target.value)}
              className={clsx('h-8', portError && 'border-destructive')}
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              autoComplete="off"
            />
          </ContentItemForm>
        </ContentItem>

        <p
          className={clsx(
            'text-xs',
            hasError ? 'text-destructive' : 'text-muted-foreground',
          )}
        >
          {statusMessage()}
        </p>

        <p className="text-xs text-muted-foreground">
          {t('settings.widget.server.security')}
        </p>
      </Content>
      <ContentSeparator />
    </Root>
  )
}
