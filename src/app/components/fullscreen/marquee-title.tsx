import { ReactNode, useEffect, useRef, useState } from 'react'
import clsx from 'clsx'

export function MarqueeTitle({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const [isOverflowing, setIsOverflowing] = useState(false)

  useEffect(() => {
    if (!containerRef && !textRef) return

    const containerWidth = containerRef.current?.offsetWidth || 0
    const textWidth = textRef.current?.offsetWidth || 0

    if (textWidth > containerWidth) {
      setIsOverflowing(true)
    } else {
      setIsOverflowing(false)
    }
  }, [children])

  return (
    <div
      ref={containerRef}
      className="overflow-hidden whitespace-nowrap relative"
    >
      <div
        ref={textRef}
        className={clsx(
          'inline-block will-change-transform',
          isOverflowing && 'animate-marquee',
        )}
      >
        {children}
      </div>
    </div>
  )
}
