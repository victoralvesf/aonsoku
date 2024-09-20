import { Globe, Keyboard, LogOut, User } from 'lucide-react'
import { useState } from 'react'
import { Fragment } from 'react/jsx-runtime'
import { useHotkeys } from 'react-hotkeys-hook'
import { useTranslation } from 'react-i18next'

import { ShortcutsDialog } from '@/app/components/shortcuts/dialog'
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
import { LogoutObserver } from '@/app/observers/logout-observer'
import { useAppData, useAppStore } from '@/store/app.store'

export function BrowserLogout() {
  const { username, url } = useAppData()
  const setLogoutDialogState = useAppStore(
    (state) => state.actions.setLogoutDialogState,
  )
  const { t } = useTranslation()
  const [shortcutsOpen, setShortcutsOpen] = useState(false)

  useHotkeys('shift+ctrl+q', () => setLogoutDialogState(true))
  useHotkeys('mod+/', () => setShortcutsOpen((prev) => !prev))

  return (
    <Fragment>
      <LogoutObserver />

      <ShortcutsDialog
        open={shortcutsOpen}
        onOpenChange={(open) => setShortcutsOpen(open)}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="w-8 h-8 p-0 rounded-full">
            <Avatar className="w-8 h-8">
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
          <DropdownMenuItem onClick={() => setShortcutsOpen(true)}>
            <Keyboard className="mr-2 h-4 w-4" />
            <span>{t('shortcuts.modal.title')}</span>
            <DropdownMenuShortcut>{'⌘/'}</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setLogoutDialogState(true)}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>{t('menu.serverLogout')}</span>
            <DropdownMenuShortcut>{'⇧⌃Q'}</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Fragment>
  )
}
