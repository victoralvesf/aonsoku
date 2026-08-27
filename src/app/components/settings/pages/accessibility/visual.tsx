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
import { SteppedSlider } from '@/app/components/ui/stepped-slider'
import { shortcutKeys } from '@/shortcuts'
import { useAppZoomLevel } from '@/store/app.store'
import { zoomLevels } from '@/utils/zoom'

export function Visual() {
  const { t } = useTranslation()
  const { zoomLevel, setZoomLevel } = useAppZoomLevel()

  const infoText = t('settings.accessibility.visual.zoom.info', {
    key: shortcutKeys.META_TEXT,
  })

  return (
    <Root>
      <Header>
        <HeaderTitle>{t('settings.accessibility.visual.group')}</HeaderTitle>
        <HeaderDescription>
          {t('settings.accessibility.visual.description')}
        </HeaderDescription>
      </Header>
      <Content>
        <ContentItem className="w-full flex-col gap-2 items-start">
          <ContentItemTitle info={infoText}>
            {t('settings.accessibility.visual.zoom.label')}
          </ContentItemTitle>
          <ContentItemForm className="flex flex-col w-full max-w-full pb-4">
            <SteppedSlider
              steps={zoomLevels}
              value={zoomLevel}
              onStepChange={setZoomLevel}
            />
          </ContentItemForm>
        </ContentItem>
      </Content>
      <ContentSeparator />
    </Root>
  )
}
