import { useContext } from 'react';
import { Outlet } from 'react-router-dom'
import { clsx } from 'clsx/lite'
import { ThemeToggle } from "../components/theme-toggle";
import { Menu } from "./menu";
import { Sidebar } from "./sidebar";
import { ScrollArea } from '../components/ui/scroll-area';
import AppContext from '../contexts/app-context';

export default function BaseLayout() {
  const { osType } = useContext(AppContext)
  const isMacOS = osType === 'Darwin'

  return (
    <div className="hidden md:block h-screen overflow-hidden">
      {/* Header */}
      <div className={clsx('flex', 'items-center', isMacOS && 'justify-end', !isMacOS && 'justify-between')}>
        {!isMacOS && (
          <Menu />
        )}
        <ThemeToggle />
      </div>
      {/* Middle */}
      <div className="border-t h-[calc(100%-140px)]">
        <div className="bg-background h-full">
          <div className="flex h-full">
            <Sidebar className="hidden lg:block w-[280px] min-w-[280px] border-r h-full overflow-hidden" />
            <ScrollArea className="w-full">
              <div className="px-4 py-6 lg:px-8">
                {/* Routes */}
                <Outlet />
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
      {/* Player */}
      <div className="border-t h-[100px]">
        Player
      </div>
    </div>
  )
}