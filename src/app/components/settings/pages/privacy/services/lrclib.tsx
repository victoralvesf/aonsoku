import { zodResolver } from '@hookform/resolvers/zod'
import clsx from 'clsx'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useDebouncedCallback } from 'use-debounce'
import { z } from 'zod'
import {
  ContentItem,
  ContentItemForm,
  ContentItemTitle,
  ContentSeparator,
} from '@/app/components/settings/section'
import { Input } from '@/app/components/ui/input'
import { Switch } from '@/app/components/ui/switch'
import { useLrcLibSettings } from '@/store/player.store'

const { DISABLE_LRCLIB } = window

const formSchema = z.object({
  customUrl: z
    .string()
    .url({ message: 'login.form.validations.url' })
    .optional(),
})

type FormSchemaType = z.infer<typeof formSchema>

export function LrcLib() {
  const { t } = useTranslation()
  const {
    enabled,
    setEnabled,
    customUrlEnabled,
    setCustomUrlEnabled,
    customUrl,
    setCustomUrl,
  } = useLrcLibSettings()

  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customUrl: customUrl,
    },
  })

  const debounce = useDebouncedCallback((data: Partial<FormSchemaType>) => {
    if (data.customUrl !== undefined) {
      setCustomUrl(data.customUrl)
    }
  }, 500)

  watch((data) => {
    debounce(data)
  })

  const isLrclibEnabled = DISABLE_LRCLIB ? false : enabled

  return (
    <>
      <ContentItem>
        <ContentItemTitle info={t('settings.privacy.services.lrclib.info')}>
          {t('settings.privacy.services.lrclib.label')}
        </ContentItemTitle>
        <ContentItemForm>
          <Switch
            checked={isLrclibEnabled}
            onCheckedChange={setEnabled}
            disabled={DISABLE_LRCLIB}
          />
        </ContentItemForm>
      </ContentItem>

      {isLrclibEnabled && (
        <ContentItem>
          <ContentItemTitle
            info={t('settings.privacy.services.lrclib.customUrl.info')}
          >
            {t('settings.privacy.services.lrclib.customUrl.toggle')}
          </ContentItemTitle>
          <ContentItemForm>
            <Switch
              checked={customUrlEnabled}
              onCheckedChange={setCustomUrlEnabled}
            />
          </ContentItemForm>
        </ContentItem>
      )}

      {customUrlEnabled && isLrclibEnabled && (
        <ContentItem>
          <ContentItemTitle
            info={t('settings.privacy.services.lrclib.customUrl.example')}
          >
            {t('settings.privacy.services.lrclib.customUrl.label')}
          </ContentItemTitle>
          <ContentItemForm>
            <Input
              {...register('customUrl')}
              className={clsx('h-8', errors.customUrl && 'border-destructive')}
              onChange={(e) => {
                setValue('customUrl', e.target.value, {
                  shouldValidate: true,
                })
              }}
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              autoComplete="off"
            />
          </ContentItemForm>
        </ContentItem>
      )}

      <ContentSeparator className="!mt-3" />
    </>
  )
}
