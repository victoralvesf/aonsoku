import clsx from 'clsx'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import { ISidebarItem } from '@/app/components/sidebar/sidebar-generator'
import { Button } from '@/app/components/ui/button'

export function MiniSidebarItem({ item }: { item: ISidebarItem }) {
  const location = useLocation()
  const { t } = useTranslation()

  function isActive(route: string) {
    return location.pathname === route
  }

  return (
    <Link
      to={item.route}
      className={clsx('w-full', isActive(item.route) && 'pointer-events-none')}
    >
      <Button
        variant={isActive(item.route) ? 'secondary' : 'ghost'}
        className={clsx(
          'w-full h-fit flex flex-col justify-center items-center gap-1',
          isActive(item.route) && 'text-primary',
        )}
      >
        {item.icon}
        <span className="text-xs font-normal">{t(item.title)}</span>
      </Button>
    </Link>
  )
}
