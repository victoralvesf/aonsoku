import { Dialog, DialogContent } from '@/app/components/ui/dialog'
import { ScrollArea } from '@/app/components/ui/scroll-area'
import {
  Sidebar,
  SidebarContent,
  SidebarProvider,
} from '@/app/components/ui/sidebar'
import { useAppSettings } from '@/store/app.store'
import { SettingsBreadcrumb } from './breadcrumb'
import { SettingsOptions } from './options'

export function SettingsDialog() {
  const { openDialog, setOpenDialog } = useAppSettings()

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent className="overflow-hidden p-0 md:max-h-[500px] md:max-w-[700px] lg:max-w-[800px]">
        <SidebarProvider className="items-start">
          <Sidebar collapsible="none" className="hidden md:flex">
            <SidebarContent>
              <SettingsOptions />
            </SidebarContent>
          </Sidebar>
          <main className="flex h-[500px] flex-1 flex-col overflow-hidden bg-background-foreground">
            <SettingsBreadcrumb />
            <ScrollArea>
              <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-video max-w-3xl rounded-xl bg-muted/50"
                  />
                ))}
              </div>
            </ScrollArea>
          </main>
        </SidebarProvider>
      </DialogContent>
    </Dialog>
  )
}
