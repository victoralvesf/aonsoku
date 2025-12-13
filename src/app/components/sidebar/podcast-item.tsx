import { ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/app/components/ui/collapsible'
import {
  MainSidebarMenuButton,
  MainSidebarMenuItem,
  MainSidebarMenuSub,
  MainSidebarMenuSubButton,
  MainSidebarMenuSubItem,
} from '@/app/components/ui/main-sidebar'
import { ROUTES } from '@/routes/routesList'
import { ISidebarItem } from './sidebar-generator'

export function SidebarPodcastItem({ item }: { item: ISidebarItem }) {
  const { t } = useTranslation()

  return (
    <Collapsible key={item.title} asChild className="group/collapsible">
      <MainSidebarMenuItem>
        <CollapsibleTrigger asChild>
          <MainSidebarMenuButton tooltip={t(item.title)}>
            <item.icon />
            {t(item.title)}
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </MainSidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <MainSidebarMenuSub>
            <MainSidebarMenuSubItem>
              <MainSidebarMenuSubButton asChild>
                <Link to={ROUTES.LIBRARY.PODCASTS}>
                  {t('podcasts.form.all')}
                </Link>
              </MainSidebarMenuSubButton>
            </MainSidebarMenuSubItem>
            <MainSidebarMenuSubItem>
              <MainSidebarMenuSubButton asChild>
                <Link to={ROUTES.EPISODES.LATEST}>
                  {t('podcasts.form.latestEpisodes')}
                </Link>
              </MainSidebarMenuSubButton>
            </MainSidebarMenuSubItem>
          </MainSidebarMenuSub>
        </CollapsibleContent>
      </MainSidebarMenuItem>
    </Collapsible>
  )
}
