import { useEffect } from 'react';
import { Outlet, useLocation, Location, useMatches, UIMatch } from 'react-router-dom'
import { ThemeToggle } from "../components/theme-toggle";
import { Menu } from "./menu";
import { Sidebar } from "./sidebar";
import { ScrollArea } from '../components/ui/scroll-area';
import { useApp } from '../contexts/app-context';
import { Player } from '../components/player';
import clsx from 'clsx';

export default function BaseLayout() {
  const { osType } = useApp()
  const isMacOS = osType === 'Darwin'

  const location = useLocation() as Location
  const matches = useMatches() as UIMatch[]

  const isShowingAlbum = matches[1].id === 'album_info'

  useEffect(() => {
    document.querySelector('#main-scroll-area #scroll-viewport')?.scrollTo({ top: 0 })
  }, [location])

  return (
    <div className="hidden md:block h-screen overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between h-[40px]">
        {isMacOS ? (
          <h1 className="text-sm font-bold py-1.5 px-3 ml-4">Subsonic Player</h1>
        ) : (
          <Menu />
        )}
        <ThemeToggle className="mr-8" />
      </div>
      {/* Middle */}
      <div className="border-t h-[calc(100%-140px)]">
        <div className="bg-background h-full">
          <div className="flex h-full">
            <Sidebar className="hidden lg:block w-[280px] min-w-[280px] max-w-[280px] border-r h-full" />
            <ScrollArea id="main-scroll-area" className={clsx("w-full", !isShowingAlbum && "px-4 py-6 lg:px-8")}>
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