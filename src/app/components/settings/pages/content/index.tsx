import { PodcastContent } from './podcast'
import { SidebarContent } from './sidebar'

export function Content() {
  return (
    <div className="space-y-4">
      <SidebarContent />
      <PodcastContent />
    </div>
  )
}
