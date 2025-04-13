import { LazyLoadImage } from 'react-lazy-load-image-component'
import appIcon from '@/assets/icon_transparent.svg'

export function AppTitle() {
  return (
    <div className="flex gap-2 items-center">
      <LazyLoadImage src={appIcon} alt="Aonsoku icon" className="size-6" />
      <span className="leading-7 text-sm font-medium text-muted-foreground">
        Aonsoku
      </span>
    </div>
  )
}
