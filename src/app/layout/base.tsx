import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom'
import { ThemeToggle } from "../components/theme-toggle";
import { Menu } from "./menu";
import { Sidebar } from "./sidebar";
import { ScrollArea } from '../components/ui/scroll-area';
import { useApp } from '../contexts/app-context';
import { Player } from '../components/player';

export default function BaseLayout() {
  const { osType } = useApp()
  const isMacOS = osType === 'Darwin'

  const location = useLocation()

  useEffect(() => {
    document.querySelector('#main-scroll-area #scroll-viewport')?.scrollTo({ top: 0 })
  }, [location])

  return (
    <div className="hidden md:block h-screen overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between">
        {!isMacOS ? (
          <h1 className="text-sm font-bold py-1.5 px-3 ml-4">Subsonic Player</h1>
        ) : (
          <Menu />
        )}
        <ThemeToggle />
      </div>
      {/* Middle */}
      <div className="border-t h-[calc(100%-140px)]">
        <div className="bg-background h-full">
          <div className="flex h-full">
            <Sidebar className="hidden lg:block w-[280px] min-w-[280px] max-w-[280px] border-r h-full" />
            <ScrollArea id="main-scroll-area" className="px-4 py-6 lg:px-8 w-full">
              {/* Routes */}
              <Outlet />
            </ScrollArea>
          </div>
        </div>
      </div>
      {/* Player */}
      <Player />
    </div>
  )
}