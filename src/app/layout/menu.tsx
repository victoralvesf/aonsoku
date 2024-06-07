import { Fragment, useState } from "react"
import { Globe, Mic, LogOut } from "lucide-react"
import { useTranslation } from "react-i18next"
import { exit } from "@tauri-apps/api/process"

import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/app/components/ui/menubar"
import { useApp } from "@/app/contexts/app-context"
import { LogoutConfirmDialog } from "@/app/components/logout-confirm"
import { currentLanguages } from "@/i18n/languages"
import { useLang } from "@/app/contexts/lang-context"

export function Menu() {
  const { serverUsername, serverUrl } = useApp()
  const [logoutDialogState, setLogoutDialogState] = useState(false)
  const { t } = useTranslation()

  const { langCode, setLang } = useLang()

  async function handleQuit() {
    await exit(0)
  }

  return (
    <Fragment>
      <LogoutConfirmDialog openDialog={logoutDialogState} setOpenDialog={setLogoutDialogState} />
      <Menubar className="rounded-none border-b border-none px-2 lg:px-4">
        <MenubarMenu>
          <MenubarTrigger className="font-bold antialiased">
            Subsonic Player
          </MenubarTrigger>
          <MenubarContent>
            <MenubarItem>About Subsonic Player</MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              Preferences... <MenubarShortcut>⌘,</MenubarShortcut>
            </MenubarItem>
            <MenubarItem onClick={() => handleQuit()}>
              Quit <MenubarShortcut>⌘Q</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger className="relative">File</MenubarTrigger>
          <MenubarContent>
            <MenubarSub>
              <MenubarSubTrigger>New</MenubarSubTrigger>
              <MenubarSubContent className="w-[230px]">
                <MenubarItem>
                  Playlist <MenubarShortcut>⌘N</MenubarShortcut>
                </MenubarItem>
                <MenubarItem disabled>
                  Playlist from Selection <MenubarShortcut>⇧⌘N</MenubarShortcut>
                </MenubarItem>
                <MenubarItem>
                  Smart Playlist... <MenubarShortcut>⌥⌘N</MenubarShortcut>
                </MenubarItem>
                <MenubarItem>Playlist Folder</MenubarItem>
                <MenubarItem disabled>Genius Playlist</MenubarItem>
              </MenubarSubContent>
            </MenubarSub>
            <MenubarItem>
              Open Stream URL... <MenubarShortcut>⌘U</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              Close Window <MenubarShortcut>⌘W</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarSub>
              <MenubarSubTrigger>Library</MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarItem>Update Cloud Library</MenubarItem>
                <MenubarItem>Update Genius</MenubarItem>
                <MenubarSeparator />
                <MenubarItem>Organize Library...</MenubarItem>
                <MenubarItem>Export Library...</MenubarItem>
                <MenubarSeparator />
                <MenubarItem>Import Playlist...</MenubarItem>
                <MenubarItem disabled>Export Playlist...</MenubarItem>
                <MenubarItem>Show Duplicate Items</MenubarItem>
                <MenubarSeparator />
                <MenubarItem>Get Album Artwork</MenubarItem>
                <MenubarItem disabled>Get Track Names</MenubarItem>
              </MenubarSubContent>
            </MenubarSub>
            <MenubarItem>
              Import... <MenubarShortcut>⌘O</MenubarShortcut>
            </MenubarItem>
            <MenubarItem disabled>Burn Playlist to Disc...</MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              Show in Finder <MenubarShortcut>⇧⌘R</MenubarShortcut>{" "}
            </MenubarItem>
            <MenubarItem>Convert</MenubarItem>
            <MenubarSeparator />
            <MenubarItem>Page Setup...</MenubarItem>
            <MenubarItem disabled>
              Print... <MenubarShortcut>⌘P</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Edit</MenubarTrigger>
          <MenubarContent>
            <MenubarItem disabled>
              Undo <MenubarShortcut>⌘Z</MenubarShortcut>
            </MenubarItem>
            <MenubarItem disabled>
              Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem disabled>
              Cut <MenubarShortcut>⌘X</MenubarShortcut>
            </MenubarItem>
            <MenubarItem disabled>
              Copy <MenubarShortcut>⌘C</MenubarShortcut>
            </MenubarItem>
            <MenubarItem disabled>
              Paste <MenubarShortcut>⌘V</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              Select All <MenubarShortcut>⌘A</MenubarShortcut>
            </MenubarItem>
            <MenubarItem disabled>
              Deselect All <MenubarShortcut>⇧⌘A</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              Smart Dictation...{" "}
              <MenubarShortcut>
                <Mic className="h-4 w-4" />
              </MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              Emoji & Symbols{" "}
              <MenubarShortcut>
                <Globe className="h-4 w-4" />
              </MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>View</MenubarTrigger>
          <MenubarContent>
            <MenubarCheckboxItem>Show Playing Next</MenubarCheckboxItem>
            <MenubarCheckboxItem checked>Show Lyrics</MenubarCheckboxItem>
            <MenubarSeparator />
            <MenubarItem inset disabled>
              Show Status Bar
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem inset>Hide Sidebar</MenubarItem>
            <MenubarItem disabled inset>
              Enter Full Screen
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>{t('menu.language')}</MenubarTrigger>
          <MenubarContent>
            {Object.entries(currentLanguages).map(([lang, value]) => (
              <MenubarCheckboxItem
                key={lang}
                onClick={() => setLang(lang)}
                checked={lang === langCode}
              >
                {value.nativeName}
              </MenubarCheckboxItem>
            ))}
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>{t('menu.server')}</MenubarTrigger>
          <MenubarContent>
            <MenubarLabel className="capitalize font-normal">{serverUsername}</MenubarLabel>
            <MenubarLabel>{serverUrl}</MenubarLabel>
            <MenubarSeparator />
            <MenubarItem onClick={() => setLogoutDialogState(!logoutDialogState)}>
              {t('menu.serverLogout')}
              <MenubarShortcut>
                <LogOut className="h-4 w-4" />
              </MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </Fragment>
  )
}