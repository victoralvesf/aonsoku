import { Outlet } from 'react-router-dom'
import { ThemeToggle } from "../components/theme-toggle";
import { Menu } from "./menu";
import { Sidebar } from "./sidebar";

export default function BaseLayout() {
  return (
    <div className="hidden md:block h-screen overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center">
        <Menu />
        <ThemeToggle />
      </div>
      {/* Middle */}
      <div className="border-t h-[calc(100%-140px)]">
        <div className="bg-background h-full">
          <div className="flex h-full">
            <Sidebar className="hidden lg:block w-[280px] min-w-[280px] border-r h-full overflow-hidden" />
            <div className="w-full overflow-y-auto">
              <div className="px-4 py-6 lg:px-8">
                {/* Routes */}
                <Outlet />
              </div>
            </div>
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