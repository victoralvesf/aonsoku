import clsx from 'clsx'
import { ChevronRight } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import { ISidebarItem } from '@/app/components/sidebar/sidebar-generator'
import { Button } from '@/app/components/ui/button'
import { ROUTES } from '@/routes/routesList'

export function PodcastSidebarItem({ item }: { item: ISidebarItem }) {
  const location = useLocation()
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  const isActive = useCallback(
    (route: string) => {
      return location.pathname === route
    },
    [location.pathname],
  )

  const isPodcastActive = isActive(item.route)
  const isLatestEpisodesActive = isActive(ROUTES.EPISODES.LATEST)

  return (
    <div
      data-open={open}
      className={clsx(
        'flex flex-col relative overflow-hidden',
        'transition-[max-height] duration-300 ease-in-out',
        'data-[open=false]:max-h-9 data-[open=true]:max-h-[72px]',
      )}
    >
      <Link to={item.route} className="z-10 relative">
        <Button
          variant={isPodcastActive ? 'secondary' : 'ghost'}
          size="sm"
          className={clsx(
            'w-full justify-start',
            isPodcastActive ? 'bg-accent pointer-events-none' : 'bg-background',
          )}
        >
          <item.icon className="w-4 h-4 mr-2" />
          {t(item.title)}
        </Button>
        <Button
          size="icon"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()

            setOpen((prev) => !prev)
          }}
          className="absolute right-2 top-2 p-0 w-5 h-5"
          disabled={isLatestEpisodesActive}
        >
          <ChevronRight
            data-visible={open}
            className={clsx(
              'w-4 h-4 transition-transform duration-150',
              'data-[visible=true]:rotate-90 ease-in-out',
            )}
            strokeWidth={2.5}
          />
        </Button>
      </Link>
      <div
        data-visible={open}
        className={clsx(
          'my-1 overflow-hidden ease-in-out',
          'transition-[transform,opacity] duration-300',
          'data-[visible=false]:-translate-y-9',
          'data-[visible=false]:opacity-0',
          'data-[visible=false]:pointer-events-none',
        )}
      >
        <div className="mx-5 pl-2.5 border-l">
          <Link
            to={ROUTES.EPISODES.LATEST}
            className={clsx(isLatestEpisodesActive && 'pointer-events-none')}
          >
            <Button
              variant={isLatestEpisodesActive ? 'secondary' : 'ghost'}
              size="sm"
              className="w-full justify-start text-sm font-normal px-3 py-1 h-7"
            >
              {t('podcasts.form.latestEpisodes')}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
