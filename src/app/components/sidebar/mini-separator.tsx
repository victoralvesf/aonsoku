import { Separator } from '@/app/components/ui/separator'
import { useMainSidebar } from '../ui/main-sidebar'

export function SidebarMiniSeparator() {
  const { state } = useMainSidebar()

  if (state === 'expanded') {
    return null
  }

  return (
    <div className="px-4 mb-2 mt-1">
      <Separator />
    </div>
  )
}
