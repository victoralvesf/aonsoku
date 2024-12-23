import { MiniSidebarItem } from '@/app/components/sidebar/mini-item'
import { MiniSidebarSearch } from '@/app/components/sidebar/mini-search'
import { libraryItems, mainMenuItems } from './sidebar'

export function MiniSidebar() {
  return (
    <aside className="flex 2xl:hidden flex-col items-center justify-start gap-1 min-w-[--mini-sidebar-width] max-w-[--mini-sidebar-width] border-r fixed top-[--header-height] left-0 bottom-0 pb-[--player-height] bg-background z-10 p-2">
      <MiniSidebarSearch />

      {menuItems.map((item) => (
        <MiniSidebarItem item={item} key={item.route} />
      ))}
    </aside>
  )
}

const menuItems = [...mainMenuItems, ...libraryItems]
