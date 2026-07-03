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

const hideArtistsSectionConfig = window.HIDE_ARTISTS_SECTION ?? false
const hideSongsSectionConfig = window.HIDE_SONGS_SECTION ?? false
const hideAlbumsSectionConfig = window.HIDE_ALBUMS_SECTION ?? false
const hideGenresSectionConfig = window.HIDE_GENRES_SECTION ?? false
const hideRadiosSectionConfig = window.HIDE_RADIOS_SECTION ?? false

export function SidebarContent() {
  const { t } = useTranslation()
  const {
    hideArtistsSection,
    setHideArtistsSection,
    hideSongsSection,
    setHideSongsSection,
    hideAlbumsSection,
    setHideAlbumsSection,
    hideGenresSection,
    setHideGenresSection,
    hideRadiosSection,
    setHideRadiosSection,
  } = useAppPages()

  return (
    <Root>
      <Header>
        <HeaderTitle>{t('settings.content.sidebar.group')}</HeaderTitle>
        <HeaderDescription>
          {t('settings.content.sidebar.description')}
        </HeaderDescription>
      </Header>
      <Content>
        <ContentItem>
          <ContentItemTitle>{t('sidebar.artists')}</ContentItemTitle>
          <ContentItemForm>
            <Switch
              checked={!hideArtistsSection}
              onCheckedChange={(val) => setHideArtistsSection(!val)}
              disabled={hideArtistsSectionConfig}
            />
          </ContentItemForm>
        </ContentItem>
        <ContentItem>
          <ContentItemTitle>{t('sidebar.songs')}</ContentItemTitle>
          <ContentItemForm>
            <Switch
              checked={!hideSongsSection}
              onCheckedChange={(val) => setHideSongsSection(!val)}
              disabled={hideSongsSectionConfig}
            />
          </ContentItemForm>
        </ContentItem>
        <ContentItem>
          <ContentItemTitle>{t('sidebar.albums')}</ContentItemTitle>
          <ContentItemForm>
            <Switch
              checked={!hideAlbumsSection}
              onCheckedChange={(val) => setHideAlbumsSection(!val)}
              disabled={hideAlbumsSectionConfig}
            />
          </ContentItemForm>
        </ContentItem>
        <ContentItem>
          <ContentItemTitle>{t('sidebar.genres')}</ContentItemTitle>
          <ContentItemForm>
            <Switch
              checked={!hideGenresSection}
              onCheckedChange={(val) => setHideGenresSection(!val)}
              disabled={hideGenresSectionConfig}
            />
          </ContentItemForm>
        </ContentItem>
        <ContentItem>
          <ContentItemTitle>{t('sidebar.radios')}</ContentItemTitle>
          <ContentItemForm>
            <Switch
              checked={!hideRadiosSection}
              onCheckedChange={(val) => setHideRadiosSection(!val)}
              disabled={hideRadiosSectionConfig}
            />
          </ContentItemForm>
        </ContentItem>
      </Content>
      <ContentSeparator />
    </Root>
  )
}
