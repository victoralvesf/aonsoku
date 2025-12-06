import { XIcon } from 'lucide-react'
import { AppTitle } from '@/app/components/header/app-title'
import { Button } from '@/app/components/ui/button'
import { useMainSidebar } from '@/app/components/ui/main-sidebar'

export function MobileCloseButton() {
  const { setOpenMobile } = useMainSidebar()

  return (
    <div className="flex md:hidden justify-between items-center pt-4 px-4">
      <AppTitle />
      <Button
        variant="ghost"
        onClick={() => setOpenMobile(false)}
        size="icon"
        className="size-8"
      >
        <XIcon className="size-4" />
      </Button>
    </div>
  )
}
