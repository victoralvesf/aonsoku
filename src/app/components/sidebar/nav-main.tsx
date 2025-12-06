import { Home } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import {
  MainSidebarGroup,
  MainSidebarMenu,
  MainSidebarMenuButton,
  MainSidebarMenuItem,
} from '@/app/components/ui/main-sidebar'
import { SidebarItems } from '@/app/layout/sidebar'
import { ROUTES } from '@/routes/routesList'

export const mainNavItems = [
  {
    id: SidebarItems.Home,
    title: 'sidebar.home',
    route: ROUTES.LIBRARY.HOME,
    icon: Home,
  },
]

export function NavMain() {
  const { t } = useTranslation()

  return (
    <MainSidebarGroup className="px-4">
      <MainSidebarMenu>
        {mainNavItems.map((item) => (
          <MainSidebarMenuItem key={item.id}>
            <MainSidebarMenuButton asChild>
              <Link to={item.route}>
                <item.icon />
                {t(item.title)}
              </Link>
            </MainSidebarMenuButton>
          </MainSidebarMenuItem>
        ))}
      </MainSidebarMenu>
    </MainSidebarGroup>
  )
}
