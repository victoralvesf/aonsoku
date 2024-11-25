import { LazyLoadImage } from 'react-lazy-load-image-component'
import { tauriDragRegion } from '@/utils/tauriDragRegion'

export function AppTitle() {
  return (
    <div {...tauriDragRegion} className="flex gap-2 items-center">
      <div className="w-6 h-6 rounded bg-accent flex items-center justify-center">
        <LazyLoadImage
          {...tauriDragRegion}
          src="/icon_transparent.svg"
          alt="Aonsoku icon"
          className="w-5 h-5"
        />
      </div>
      <span
        {...tauriDragRegion}
        className="leading-7 text-sm font-medium text-muted-foreground"
      >
        Aonsoku
      </span>
    </div>
  )
}
