import { isLinux } from '@/utils/desktop'

export function FullscreenDragHandler() {
  if (!isLinux) return null

  return (
    <div className="absolute h-header left-0 right-[94px] electron-drag z-10" />
  )
}
