import { Home } from 'lucide-react'
import {
  MainSidebarGroup,
  MainSidebarMenu,
} from '@/app/components/ui/main-sidebar'
import { SidebarItems } from '@/app/layout/sidebar'
import { ROUTES } from '@/routes/routesList'
import { SidebarMainItem } from './main-item'

export const mainNavItems = [
  {
    id: SidebarItems.Home,
    title: 'sidebar.home',
    route: ROUTES.LIBRARY.HOME,
    icon: Home,
  },
]

export function NavMain() {
  return (
    <MainSidebarGroup className="px-4">
      <MainSidebarMenu>
        {mainNavItems.map((item) => (
          <SidebarMainItem key={item.id} item={item} />
        ))}
      </MainSidebarMenu>
    </MainSidebarGroup>
  )
}
