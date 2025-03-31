import { useTranslation } from 'react-i18next'
import { Dialog, DialogContent, DialogTitle } from '@/app/components/ui/dialog'
import { ScrollArea } from '@/app/components/ui/scroll-area'
import {
  Sidebar,
  SidebarContent,
  SidebarProvider,
} from '@/app/components/ui/sidebar'
import { useAppSettings } from '@/store/app.store'
import { SettingsBreadcrumb } from './breadcrumb'
import { SettingsOptions } from './options'
import { Pages } from './pages'

export function SettingsDialog() {
  const { t } = useTranslation()
  const { openDialog, setOpenDialog } = useAppSettings()

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent
        className="overflow-hidden p-0 h-[500px] max-h-[600px] max-w-3xl 2xl:h-[600px] 2xl:max-h-[700px] 2xl:max-w-4xl"
        aria-describedby={undefined}
      >
        <DialogTitle className="sr-only">{t('settings.label')}</DialogTitle>
        <SidebarProvider className="min-h-full">
          <Sidebar collapsible="none" className="hidden md:flex">
            <SidebarContent>
              <SettingsOptions />
            </SidebarContent>
          </Sidebar>
          <main className="flex flex-1 flex-col overflow-hidden bg-background-foreground">
            <SettingsBreadcrumb />
            <ScrollArea className="overflow-hidden">
              <div className="w-full h-full gap-4 p-4 pt-0">
                <Pages />
              </div>
            </ScrollArea>
          </main>
        </SidebarProvider>
      </DialogContent>
    </Dialog>
  )
}
