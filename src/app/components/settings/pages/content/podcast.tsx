import { zodResolver } from '@hookform/resolvers/zod'
import clsx from 'clsx'
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
      message: 'User and Server Url are required when Use Logged User is false',
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
      serviceUrl,
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
        <HeaderTitle>Podcast Integration</HeaderTitle>
        <HeaderDescription>
          Enable integration to Aonsoku Podcasts service
        </HeaderDescription>
      </Header>
      <Content>
        <ContentItem>
          <ContentItemTitle>Enabled</ContentItemTitle>
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
              Service URL
              {errors.serviceUrl?.message && (
                <p className="text-destructive text-xs mt-1">
                  {t(errors.serviceUrl.message)}
                </p>
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
              />
            </ContentItemForm>
          </ContentItem>
        )}

        {watch('active') && (
          <ContentItem>
            <ContentItemTitle>
              Use logged User and Server URL
              {errors.useDefaultUser?.message && (
                <p className="text-destructive text-xs mt-1">
                  {t(errors.useDefaultUser.message)}
                </p>
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
                User
                {errors.customUser?.message && (
                  <p className="text-destructive text-xs mt-1">
                    {t(errors.customUser.message)}
                  </p>
                )}
              </ContentItemTitle>
              <ContentItemForm>
                <Input
                  {...register('customUser')}
                  className={clsx(
                    'h-8',
                    errors.serviceUrl && 'border-destructive',
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
                Server URL
                {errors.customUrl?.message && (
                  <p className="text-destructive text-xs mt-1">
                    {t(errors.customUrl.message)}
                  </p>
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
