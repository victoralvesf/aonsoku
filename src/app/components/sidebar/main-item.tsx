import clsx from 'clsx'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { MainSidebarMenuButton } from '@/app/components/ui/main-sidebar'
import { useRouteIsActive } from '@/app/hooks/use-route-is-active'
import { ISidebarItem } from './sidebar-generator'

export function SidebarMainItem({ item }: { item: ISidebarItem }) {
  const { t } = useTranslation()
  const { isActive } = useRouteIsActive()

  return (
    <MainSidebarMenuButton
      asChild
      tooltip={t(item.title)}
      className={clsx(isActive(item.route) && 'bg-accent')}
    >
      <Link
        to={item.route}
        className={clsx(isActive(item.route) && 'pointer-events-none')}
      >
        <item.icon />
        {t(item.title)}
      </Link>
    </MainSidebarMenuButton>
  )
}
