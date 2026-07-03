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
import { useAppPages } from '@/store/app.store'

const hideFavoritesSectionConfig = window.HIDE_FAVORITES_SECTION ?? false
const hidePlaylistsSectionConfig = window.HIDE_PLAYLISTS_SECTION ?? false

export function FeatureContent() {
  const { t } = useTranslation()
  const {
    hideFavoritesSection,
    setHideFavoritesSection,
    hidePlaylistsSection,
    setHidePlaylistsSection,
  } = useAppPages()

  return (
    <Root>
      <Header>
        <HeaderTitle>{t('settings.content.features.group')}</HeaderTitle>
        <HeaderDescription>
          {t('settings.content.features.description')}
        </HeaderDescription>
      </Header>
      <Content>
        <ContentItem>
          <ContentItemTitle>{t('sidebar.favorites')}</ContentItemTitle>
          <ContentItemForm>
            <Switch
              checked={!hideFavoritesSection}
              onCheckedChange={(val) => setHideFavoritesSection(!val)}
              disabled={hideFavoritesSectionConfig}
            />
          </ContentItemForm>
        </ContentItem>
        <ContentItem>
          <ContentItemTitle>{t('sidebar.playlists')}</ContentItemTitle>
          <ContentItemForm>
            <Switch
              checked={!hidePlaylistsSection}
              onCheckedChange={(val) => setHidePlaylistsSection(!val)}
              disabled={hidePlaylistsSectionConfig}
            />
          </ContentItemForm>
        </ContentItem>
      </Content>
      <ContentSeparator />
    </Root>
  )
}
