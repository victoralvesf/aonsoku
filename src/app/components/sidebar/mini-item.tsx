import clsx from 'clsx'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import { PodcastMiniSidebarItem } from '@/app/components/podcasts/sidebar-item'
import { ISidebarItem } from '@/app/components/sidebar/sidebar-generator'
import { Button } from '@/app/components/ui/button'
import { SimpleTooltip } from '@/app/components/ui/simple-tooltip'
import { ROUTES } from '@/routes/routesList'

export function MiniSidebarItem({ item }: { item: ISidebarItem }) {
  const location = useLocation()
  const { t } = useTranslation()

  function isActive(route: string) {
    return location.pathname === route
  }

  return (
    <>
      <Link
        to={item.route}
        className={clsx(
          'w-full',
          isActive(item.route) && 'pointer-events-none',
        )}
      >
        <SimpleTooltip text={t(item.title)} side="right" delay={50}>
          <Button
            variant={isActive(item.route) ? 'secondary' : 'ghost'}
            className="w-full h-fit flex flex-col justify-center items-center gap-1"
          >
            <item.icon className="w-4 h-4" />
          </Button>
        </SimpleTooltip>
      </Link>
      {item.id === 'podcasts' && (
        <PodcastMiniSidebarItem isActive={isActive(ROUTES.EPISODES.LATEST)} />
      )}
    </>
  )
}
