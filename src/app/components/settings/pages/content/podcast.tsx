import { zodResolver } from '@hookform/resolvers/zod'
import clsx from 'clsx'
import { ComponentPropsWithoutRef } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
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
import { Input } from '@/app/components/ui/input'
import { Switch } from '@/app/components/ui/switch'
import { cn } from '@/lib/utils'
import { useAppPodcasts } from '@/store/app.store'

const podcastSchema = z
  .object({
    serviceUrl: z.string().url({ message: 'login.form.validations.url' }),
    customUser: z.string().optional(),
    customUrl: z
      .string()
      .url({ message: 'login.form.validations.url' })
      .optional(),
    useDefaultUser: z.boolean(),
    active: z.boolean(),
  })
  .refine(
    (data) => {
      const customUser = data.customUser?.length ?? 0
      const customUrl = data.customUrl?.length ?? 0

      return data.useDefaultUser === true || (customUser > 0 && customUrl > 0)
    },
    {
      message: 'settings.content.podcast.credentials.error',
      path: ['useDefaultUser'],
    },
  )

export function PodcastContent() {
  const { t } = useTranslation()
  const {
    active,
    setActive,
    serviceUrl,
    setServiceUrl,
    useDefaultUser,
    setUseDefaultUser,
    customUser,
    setCustomUser,
    customUrl,
    setCustomUrl,
  } = useAppPodcasts()

  const {
    register,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(podcastSchema),
    defaultValues: {
      active,
      serviceUrl: serviceUrl || 'http://',
      useDefaultUser,
      customUser,
      customUrl,
    },
  })

  watch((data) => {
    if (data.active !== undefined) setActive(data.active)
    if (data.serviceUrl !== undefined) setServiceUrl(data.serviceUrl)
    if (data.useDefaultUser !== undefined)
      setUseDefaultUser(data.useDefaultUser)
    if (data.customUser !== undefined) setCustomUser(data.customUser)
    if (data.customUrl !== undefined) setCustomUrl(data.customUrl)
  })

  return (
    <Root>
      <Header>
        <HeaderTitle>{t('settings.content.podcast.group')}</HeaderTitle>
        <HeaderDescription>
          {t('settings.content.podcast.description')}
        </HeaderDescription>
      </Header>
      <Content>
        <ContentItem>
          <ContentItemTitle>
            {t('settings.content.podcast.enabled.label')}
          </ContentItemTitle>
          <ContentItemForm>
            <Switch
              {...register('active')}
              checked={watch('active')}
              onCheckedChange={(checked) => {
                setValue('active', checked)
                trigger('active')
              }}
            />
          </ContentItemForm>
        </ContentItem>

        {watch('active') && (
          <ContentItem>
            <ContentItemTitle>
              {t('settings.content.podcast.service.url')}
              {errors.serviceUrl?.message && (
                <ErrorMessage>{t(errors.serviceUrl.message)}</ErrorMessage>
              )}
            </ContentItemTitle>
            <ContentItemForm>
              <Input
                {...register('serviceUrl')}
                className={clsx(
                  'h-8',
                  errors.serviceUrl && 'border-destructive',
                )}
                onChange={(e) => {
                  setValue('serviceUrl', e.target.value, {
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

        {watch('active') && (
          <ContentItem>
            <ContentItemTitle>
              {t('settings.content.podcast.credentials.label')}
              {errors.useDefaultUser?.message && (
                <ErrorMessage>{t(errors.useDefaultUser.message)}</ErrorMessage>
              )}
            </ContentItemTitle>
            <ContentItemForm>
              <Switch
                {...register('useDefaultUser')}
                checked={watch('useDefaultUser')}
                onCheckedChange={(checked) => {
                  setValue('useDefaultUser', checked)
                  trigger('useDefaultUser')
                }}
              />
            </ContentItemForm>
          </ContentItem>
        )}

        {watch('active') && !watch('useDefaultUser') && (
          <>
            <ContentItem>
              <ContentItemTitle>
                {t('settings.content.podcast.credentials.user')}
                {errors.customUser?.message && (
                  <ErrorMessage>{t(errors.customUser.message)}</ErrorMessage>
                )}
              </ContentItemTitle>
              <ContentItemForm>
                <Input
                  {...register('customUser')}
                  className={clsx(
                    'h-8',
                    errors.customUser && 'border-destructive',
                  )}
                  onChange={(e) => {
                    setValue('customUser', e.target.value, {
                      shouldValidate: true,
                    })
                    trigger('useDefaultUser')
                  }}
                />
              </ContentItemForm>
            </ContentItem>
            <ContentItem>
              <ContentItemTitle>
                {t('settings.content.podcast.credentials.url')}
                {errors.customUrl?.message && (
                  <ErrorMessage>{t(errors.customUrl.message)}</ErrorMessage>
                )}
              </ContentItemTitle>
              <ContentItemForm>
                <Input
                  {...register('customUrl')}
                  className={clsx(
                    'h-8',
                    errors.customUrl && 'border-destructive',
                  )}
                  onChange={(e) => {
                    setValue('customUrl', e.target.value, {
                      shouldValidate: true,
                    })
                    trigger('useDefaultUser')
                  }}
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  autoComplete="off"
                />
              </ContentItemForm>
            </ContentItem>
          </>
        )}
      </Content>
      <ContentSeparator />
    </Root>
  )
}

function ErrorMessage({
  className,
  children,
  ...rest
}: ComponentPropsWithoutRef<'p'>) {
  return (
    <p {...rest} className={cn('text-destructive text-xs mt-1', className)}>
      {children}
    </p>
  )
}
