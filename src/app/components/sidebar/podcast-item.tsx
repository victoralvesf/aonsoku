import { ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/app/components/ui/collapsible'
import {
  MainSidebarMenuButton,
  MainSidebarMenuItem,
  MainSidebarMenuSub,
} from '@/app/components/ui/main-sidebar'
import { ISidebarItem, podcastItems } from '@/app/layout/sidebar'
import { SidebarMainSubItem } from './main-sub-item'

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
            {podcastItems.map((item) => (
              <SidebarMainSubItem key={item.id} item={item} />
            ))}
          </MainSidebarMenuSub>
        </CollapsibleContent>
      </MainSidebarMenuItem>
    </Collapsible>
  )
}
