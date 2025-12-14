import {
  MainSidebarGroup,
  MainSidebarMenu,
} from '@/app/components/ui/main-sidebar'
import { mainNavItems } from '@/app/layout/sidebar'
import { SidebarMainItem } from './main-item'

export function NavMain() {
  return (
    <MainSidebarGroup className="px-4 group-data-[collapsible=icon]:py-1">
      <MainSidebarMenu>
        {mainNavItems.map((item) => (
          <SidebarMainItem key={item.id} item={item} />
        ))}
      </MainSidebarMenu>
    </MainSidebarGroup>
  )
}
