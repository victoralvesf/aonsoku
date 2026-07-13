import { CachesContent } from './caches'
import { FeatureContent } from './features'
import { HomeContent } from './home'
import { PodcastContent } from './podcast'
import { SidebarContent } from './sidebar'

export function Content() {
  return (
    <div className="space-y-4">
      <HomeContent />
      <SidebarContent />
      <FeatureContent />
      <PodcastContent />
      <CachesContent />
    </div>
  )
}
