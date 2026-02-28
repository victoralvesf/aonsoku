import { ComponentPropsWithoutRef, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

type BlurredCanvasProps = ComponentPropsWithoutRef<'canvas'> & {
  src?: string
  blur?: number
}

export function BlurredCanvas({
  src,
  blur = 16,
  className,
}: BlurredCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !src) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = src

    img.onload = () => {
      const w = img.width
      const h = img.height

      canvas.width = w
      canvas.height = h

      ctx.clearRect(0, 0, w, h)

      ctx.filter = `blur(${blur / 4}px)`

      ctx.drawImage(img, 0, 0, w, h)

      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
      ctx.filter = 'none'
      ctx.fillRect(0, 0, w, h)
    }
  }, [src, blur])

  return (
    <canvas
      ref={canvasRef}
      className={cn('w-full h-full object-cover', className)}
      style={{ imageRendering: 'auto' }}
    />
  )
}
