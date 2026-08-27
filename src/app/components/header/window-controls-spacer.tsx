import { useAppStore } from '@/store/app.store'
import { zoomScale } from '@/utils/zoom'

const HEADER_PADDING = 16

interface WindowControlsSpacerProps {
  width: number
}

export function WindowControlsSpacer({ width }: WindowControlsSpacerProps) {
  const zoomLevel = useAppStore((state) => state.accessibility.zoomLevel)

  const reservedSpace = width + HEADER_PADDING
  const scaledWidth = reservedSpace / zoomScale(zoomLevel) - HEADER_PADDING

  return <div className="shrink-0" style={{ width: `${scaledWidth}px` }} />
}
