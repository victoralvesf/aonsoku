import clsx from 'clsx'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Button } from '@/app/components/ui/button'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/app/components/ui/hover-card'
import {
  MainSidebarMenuButton,
  MainSidebarMenuItem,
} from '@/app/components/ui/main-sidebar'
import { Separator } from '@/app/components/ui/separator'
import { useRouteIsActive } from '@/app/hooks/use-route-is-active'
import { ISidebarItem, podcastItems } from '@/app/layout/sidebar'

export function SidebarPodcastHoverItem({ item }: { item: ISidebarItem }) {
  const { t } = useTranslation()
  const { isActive } = useRouteIsActive()

  return (
    <HoverCard openDelay={0} closeDelay={200}>
      <MainSidebarMenuItem>
        <HoverCardTrigger>
          <MainSidebarMenuButton>
            <item.icon />
          </MainSidebarMenuButton>
        </HoverCardTrigger>
        <HoverCardContent side="right" align="start" className="w-48 p-0">
          <div className="py-2 px-3 text-xs font-medium text-muted-foreground">
            {t(item.title)}
          </div>
          <Separator />
          <div className="flex flex-col gap-1 p-1">
            {podcastItems.map((item) => (
              <Button
                key={item.id}
                size="sm"
                variant="ghost"
                asChild
                className={clsx(
                  'justify-start px-2 py-0 text-sm font-normal h-8 rounded-sm',
                  isActive(item.route) && 'pointer-events-none bg-accent',
                )}
              >
                <Link to={item.route}>{t(item.title)}</Link>
              </Button>
            ))}
          </div>
        </HoverCardContent>
      </MainSidebarMenuItem>
    </HoverCard>
  )
}
