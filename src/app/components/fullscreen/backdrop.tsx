import { ReactNode } from 'react'

interface FullscreenBackdropProps {
  imageUrl: string
  children: ReactNode
}

export default function FullscreenBackdrop({
  imageUrl,
  children,
}: FullscreenBackdropProps) {
  const backgroundImage = `url(${imageUrl})`

  return (
    <div
      className="w-full h-full bg-cover bg-center backdrop-blur shadow-inner bg-foreground"
      style={{ backgroundImage }}
    >
      <div className="w-full flex-1 h-full inset-0 bg-background/40 backdrop-blur-3xl supports-[backdrop-filter]:bg-background/40">
        {children}
      </div>
    </div>
  )
}
