import clsx from 'clsx'
import { ChevronRight, HistoryIcon } from 'lucide-react'
import { useCallback, useLayoutEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import { ISidebarItem } from '@/app/components/sidebar/sidebar-generator'
import { Badge } from '@/app/components/ui/badge'
import { Button } from '@/app/components/ui/button'
import { SimpleTooltip } from '@/app/components/ui/simple-tooltip'
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

  useLayoutEffect(() => {
    if (!open && isLatestEpisodesActive) {
      setOpen(true)
    }
  }, [isLatestEpisodesActive, open])

  return (
    <div
      data-open={open}
      className={clsx(
        'flex flex-col relative',
        'transition-[max-height] duration-300 ease-in-out',
        'data-[open=false]:max-h-9 data-[open=true]:max-h-[72px]',
      )}
    >
      <Link
        to={item.route}
        tabIndex={-1}
        className={clsx(
          'z-10 block relative rounded-md',
          isPodcastActive && 'pointer-events-none',
        )}
      >
        <Button
          variant={isPodcastActive ? 'secondary' : 'ghost'}
          size="sm"
          className="w-full justify-start"
        >
          <item.icon className="size-4 mr-2" />
          {t(item.title)}
          <Badge variant="beta" className="ml-2">
            {t('generic.beta')}
          </Badge>
        </Button>
        <Button
          size="icon"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()

            if (open && isLatestEpisodesActive) return

            setOpen((prev) => !prev)
          }}
          className="absolute right-2.5 top-2 p-0 w-5 h-5 z-20 pointer-events-auto"
        >
          <ChevronRight
            data-visible={open}
            className={clsx(
              'size-4 transition-transform duration-150',
              'data-[visible=true]:rotate-90 ease-in-out',
            )}
            strokeWidth={2.5}
          />
        </Button>
      </Link>
      <div
        data-visible={open}
        className={clsx(
          'py-1 overflow-hidden ease-in-out',
          'transition-[transform,opacity] duration-300',
          'data-[visible=false]:-translate-y-9',
          'data-[visible=false]:opacity-0',
          'data-[visible=false]:pointer-events-none',
        )}
      >
        <div className="ml-5 mr-2 pl-2 border-l">
          <Link
            to={ROUTES.EPISODES.LATEST}
            tabIndex={-1}
            className={clsx(
              'block',
              isLatestEpisodesActive && 'pointer-events-none',
            )}
          >
            <Button
              variant={isLatestEpisodesActive ? 'secondary' : 'ghost'}
              size="sm"
              className="w-full justify-start text-sm font-normal px-2 h-7"
              tabIndex={open ? 0 : -1}
            >
              {t('podcasts.form.latestEpisodes')}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export function PodcastMiniSidebarItem({ isActive }: { isActive: boolean }) {
  const { t } = useTranslation()

  return (
    <Link
      to={ROUTES.EPISODES.LATEST}
      className={clsx('w-full', isActive && 'pointer-events-none')}
    >
      <SimpleTooltip
        text={t('podcasts.form.latestEpisodes')}
        side="right"
        delay={50}
      >
        <Button
          variant={isActive ? 'secondary' : 'ghost'}
          className="w-full h-fit flex flex-col justify-center items-center gap-1"
        >
          <HistoryIcon className="w-4 h-4" />
        </Button>
      </SimpleTooltip>
    </Link>
  )
}
