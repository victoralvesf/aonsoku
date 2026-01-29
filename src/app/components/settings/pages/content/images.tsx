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
import { useAppImagesCacheLayer } from '@/store/app.store'

const { DISABLE_IMAGE_CACHE_TOGGLE } = window

export function ImagesContent() {
  const { t } = useTranslation()
  const { imagesCacheLayerEnabled, setImagesCacheLayerEnabled } =
    useAppImagesCacheLayer()

  return (
    <Root>
      <Header>
        <HeaderTitle>{t('settings.content.images.group')}</HeaderTitle>
        <HeaderDescription>
          {t('settings.content.images.description')}
        </HeaderDescription>
      </Header>
      <Content>
        <ContentItem>
          <ContentItemTitle info={t('settings.content.images.cacheLayer.info')}>
            {t('settings.content.images.cacheLayer.label')}
          </ContentItemTitle>
          <ContentItemForm>
            <Switch
              checked={imagesCacheLayerEnabled}
              onCheckedChange={setImagesCacheLayerEnabled}
              disabled={DISABLE_IMAGE_CACHE_TOGGLE}
            />
          </ContentItemForm>
        </ContentItem>
      </Content>
      <ContentSeparator />
    </Root>
  )
}
