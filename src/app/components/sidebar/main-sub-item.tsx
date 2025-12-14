import clsx from 'clsx'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import {
  MainSidebarMenuSubButton,
  MainSidebarMenuSubItem,
} from '@/app/components/ui/main-sidebar'
import { useRouteIsActive } from '@/app/hooks/use-route-is-active'
import { ISidebarItem } from '@/app/layout/sidebar'

export function SidebarMainSubItem({ item }: { item: ISidebarItem }) {
  const { t } = useTranslation()
  const { isActive } = useRouteIsActive()

  return (
    <MainSidebarMenuSubItem>
      <MainSidebarMenuSubButton
        asChild
        className={clsx(isActive(item.route) && 'bg-accent')}
      >
        <Link
          to={item.route}
          className={clsx(isActive(item.route) && 'pointer-events-none')}
        >
          {t(item.title)}
        </Link>
      </MainSidebarMenuSubButton>
    </MainSidebarMenuSubItem>
  )
}
