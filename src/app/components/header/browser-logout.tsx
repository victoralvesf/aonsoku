import { Globe, LogOut, User } from 'lucide-react'
import { useHotkeys } from 'react-hotkeys-hook'
import { useTranslation } from 'react-i18next'

import { Avatar, AvatarFallback } from '@/app/components/ui/avatar'
import { Button } from '@/app/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu'
import { useAppData } from '@/store/app.store'

interface BrowserLogoutProps {
  openDialog: (state: boolean) => void
}

export function BrowserLogout({ openDialog }: BrowserLogoutProps) {
  const { username, url } = useAppData()
  const { t } = useTranslation()

  useHotkeys('shift+ctrl+q', () => openDialog(true))

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="w-7 h-7 p-0 rounded-full">
          <Avatar className="w-7 h-7">
            <AvatarFallback className="text-sm">
              <User className="w-4 h-4" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem disabled>
          <User className="mr-2 h-4 w-4" />
          <span>{username}</span>
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <Globe className="mr-2 h-4 w-4" />
          <span>{url}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => openDialog(true)}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>{t('menu.serverLogout')}</span>
          <DropdownMenuShortcut>{'⇧⌃Q'}</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
