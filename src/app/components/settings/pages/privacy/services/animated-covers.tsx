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
import { useAppAnimatedCovers } from '@/store/app.store'

const formSchema = z.object({
  baseUrl: z.string().url({ message: 'login.form.validations.url' }).optional(),
})

type FormSchemaType = z.infer<typeof formSchema>

export function AnimatedCoversSettings() {
  const { t } = useTranslation()
  const {
    enabled,
    setEnabled,
    customUrlEnabled,
    setCustomUrlEnabled,
    baseUrl,
    setBaseUrl,
    screens,
  } = useAppAnimatedCovers()

  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      baseUrl,
    },
  })

  const debounce = useDebouncedCallback((data: Partial<FormSchemaType>) => {
    if (data.baseUrl !== undefined) {
      setBaseUrl(data.baseUrl)
    }
  }, 500)

  watch((data) => {
    debounce(data)
  })

  return (
    <>
      <ContentItem>
        <ContentItemTitle
          info={t('settings.privacy.services.animatedCover.enabled.info')}
        >
          {t('settings.privacy.services.animatedCover.enabled.label')}
        </ContentItemTitle>
        <ContentItemForm>
          <Switch checked={enabled} onCheckedChange={setEnabled} />
        </ContentItemForm>
      </ContentItem>

      {enabled && (
        <ContentItem>
          <ContentItemTitle
            info={t('settings.privacy.services.animatedCover.customUrl.info')}
          >
            {t('settings.privacy.services.animatedCover.customUrl.toggle')}
          </ContentItemTitle>
          <ContentItemForm>
            <Switch
              checked={customUrlEnabled}
              onCheckedChange={setCustomUrlEnabled}
            />
          </ContentItemForm>
        </ContentItem>
      )}

      {enabled && customUrlEnabled && (
        <ContentItem>
          <ContentItemTitle
            info={t(
              'settings.privacy.services.animatedCover.customUrl.example',
            )}
          >
            {t('settings.privacy.services.animatedCover.customUrl.label')}
          </ContentItemTitle>
          <ContentItemForm>
            <Input
              {...register('baseUrl')}
              className={clsx('h-8', errors.baseUrl && 'border-destructive')}
              onChange={(e) => {
                setValue('baseUrl', e.target.value, {
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

      <ContentItem>
        <ContentItemTitle
          info={t('settings.privacy.services.animatedCover.screens.album.info')}
        >
          {t('settings.privacy.services.animatedCover.screens.album.label')}
        </ContentItemTitle>
        <ContentItemForm>
          <Switch checked={screens.album} onCheckedChange={screens.setAlbum} />
        </ContentItemForm>
      </ContentItem>

      <ContentItem>
        <ContentItemTitle
          info={t(
            'settings.privacy.services.animatedCover.screens.fullscreen.info',
          )}
        >
          {t('settings.privacy.services.animatedCover.screens.fullscreen.label')}
        </ContentItemTitle>
        <ContentItemForm>
          <Switch
            checked={screens.fullscreen}
            onCheckedChange={screens.setFullscreen}
          />
        </ContentItemForm>
      </ContentItem>

      <ContentItem>
        <ContentItemTitle
          info={t(
            'settings.privacy.services.animatedCover.screens.playerBar.info',
          )}
        >
          {t('settings.privacy.services.animatedCover.screens.playerBar.label')}
        </ContentItemTitle>
        <ContentItemForm>
          <Switch
            checked={screens.playerBar}
            onCheckedChange={screens.setPlayerBar}
          />
        </ContentItemForm>
      </ContentItem>

      <ContentItem>
        <ContentItemTitle
          info={t('settings.privacy.services.animatedCover.screens.drawer.info')}
        >
          {t('settings.privacy.services.animatedCover.screens.drawer.label')}
        </ContentItemTitle>
        <ContentItemForm>
          <Switch checked={screens.drawer} onCheckedChange={screens.setDrawer} />
        </ContentItemForm>
      </ContentItem>

      <ContentSeparator className="!mt-3" />
    </>
  )
}
