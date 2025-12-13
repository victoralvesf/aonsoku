import { useTranslation } from 'react-i18next'
import {
  MainSidebarGroup,
  MainSidebarGroupLabel,
  MainSidebarMenu,
  MainSidebarMenuItem,
} from '@/app/components/ui/main-sidebar'
import { libraryItems, SidebarItems } from '@/app/layout/sidebar'
import { useAppStore } from '@/store/app.store'
import { SidebarMainItem } from './main-item'
import { SidebarPodcastItem } from './podcast-item'

export function NavLibrary() {
  const { t } = useTranslation()
  const hideRadiosSection = useAppStore().pages.hideRadiosSection
  const isPodcastsActive = useAppStore().podcasts.active

  return (
    <MainSidebarGroup className="px-4 py-0">
      <MainSidebarGroupLabel>{t('sidebar.library')}</MainSidebarGroupLabel>
      <MainSidebarMenu>
        {libraryItems.map((item) => {
          // Setting to show/hide Radios/Podcasts section
          if (hideRadiosSection && item.id === SidebarItems.Radios) return null
          if (!isPodcastsActive && item.id === SidebarItems.Podcasts)
            return null

          if (item.id === SidebarItems.Podcasts) {
            return <SidebarPodcastItem key={item.id} item={item} />
          }

          return (
            <MainSidebarMenuItem key={item.id}>
              <SidebarMainItem item={item} />
            </MainSidebarMenuItem>
          )
        })}
      </MainSidebarMenu>
    </MainSidebarGroup>
  )
}
