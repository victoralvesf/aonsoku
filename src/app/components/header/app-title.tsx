import { LazyLoadImage } from 'react-lazy-load-image-component'
import { tauriDragRegion } from '@/utils/tauriDragRegion'

export function AppTitle() {
  return (
    <div {...tauriDragRegion} className="flex gap-2 items-center">
      <LazyLoadImage
        {...tauriDragRegion}
        src="/icon_transparent.svg"
        alt="Aonsoku icon"
        className="w-6 h-6"
      />
      <span
        {...tauriDragRegion}
        className="leading-7 text-sm font-medium text-muted-foreground"
      >
        Aonsoku
      </span>
    </div>
  )
}
