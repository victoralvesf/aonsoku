import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select'

const sources = ['lrcapi', 'lrclib']

import { usePlayerStore } from '@/store/player.store'

interface LyricsSourcePrioritySelectProps {
  value: string[]
  onChange: (v: string[]) => void
}

export function LyricsSourcePrioritySelect({
  value,
  onChange,
}: LyricsSourcePrioritySelectProps) {
  const { t } = useTranslation()
  // get enabled sources from store
  const lrcLibEnabled = usePlayerStore((s) => s.settings.privacy.lrcLibEnabled)
  const lrcApiEnabled = usePlayerStore((s) => s.settings.privacy.lrcApiEnabled)

  // filter enabled sources
  const enabledSources = sources.filter(
    (src) =>
      (src === 'lrcapi' && lrcApiEnabled) ||
      (src === 'lrclib' && lrcLibEnabled),
  )

  // build select options: single source locked, multiple sources show each as 'xx Priority'
  const options =
    enabledSources.length === 1
      ? [
          {
            label:
              enabledSources[0] === 'lrcapi'
                ? t('settings.privacy.services.lrcapi.label', 'LRCAPI')
                : t('settings.privacy.services.lrclib.label', 'LRCLib'),
            value: JSON.stringify([enabledSources[0]]),
          },
        ]
      : enabledSources.map((src) => ({
          label:
            (src === 'lrcapi'
              ? t('settings.privacy.services.lrcapi.label', 'LRCAPI')
              : t('settings.privacy.services.lrclib.label', 'LRCLib')) +
            ' ' +
            t('settings.privacy.services.priority.suffix'),
          value: JSON.stringify([src]),
        }))

  // force update store if only one source is enabled
  React.useEffect(() => {
    if (
      enabledSources.length === 1 &&
      (value.length !== 1 || value[0] !== enabledSources[0])
    ) {
      onChange([enabledSources[0]])
    }
  }, [enabledSources.join(), value.join()])

  // default priority: if lrclib is enabled, use lrclib first, otherwise lrcapi
  // only use enabled sources, fallback to default
  let defaultPriority: string[] = []
  if (enabledSources.length > 0) {
    defaultPriority = enabledSources
  } else {
    defaultPriority = ['lrcapi', 'lrclib']
  }
  // keep value in sync with enabledSources (if only lrcapi is enabled, value is ["lrcapi"])
  const selectedPriority = value && value.length > 0 ? value : defaultPriority
  // force update store if only one source is enabled
  React.useEffect(() => {
    if (
      enabledSources.length === 1 &&
      (value.length !== 1 || value[0] !== enabledSources[0])
    ) {
      onChange([enabledSources[0]])
    }
  }, [enabledSources.join(), value.join()])
  const selected = JSON.stringify(selectedPriority)

  return (
    <Select
      value={selected}
      onValueChange={(v) => onChange(JSON.parse(v))}
      disabled={enabledSources.length === 0}
    >
      <SelectTrigger
        className={
          'w-[150px] h-8 ring-offset-transparent focus:ring-0 transition-colors ' +
          (enabledSources.length === 0
            ? 'bg-muted text-muted-foreground border-dashed opacity-80 cursor-not-allowed'
            : '')
        }
      >
        <SelectValue
          placeholder={
            enabledSources.length === 0
              ? t('settings.privacy.services.priority.disabled')
              : undefined
          }
        />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
