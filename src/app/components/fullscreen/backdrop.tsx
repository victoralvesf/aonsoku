import { ReactNode } from "react"

interface FullscreenBackdropProps {
  imageUrl: string
  children: ReactNode
}

export default function FullscreenBackdrop({ imageUrl, children }: FullscreenBackdropProps) {
  const backgroundImage = `url(${imageUrl})`

  return (
    <div
      className="w-full h-full bg-cover bg-center backdrop-blur shadow-inner"
      style={{ backgroundImage }}
    >
      <div className="w-full flex-1 h-full inset-0 bg-background/30 backdrop-blur-2xl supports-[backdrop-filter]:bg-background/30">
        {children}
      </div>
    </div>
  )
}