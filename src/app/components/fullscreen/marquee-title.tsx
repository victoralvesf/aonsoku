import { clsx } from 'clsx'
import { ReactNode, useEffect, useRef, useState } from 'react'

interface MarqueeTitleProps {
  children: ReactNode
  spacing?: 'low' | 'medium' | 'high'
}

export function MarqueeTitle({
  children,
  spacing = 'medium',
}: MarqueeTitleProps) {
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

  function setSpacingClass() {
    if (spacing === 'low') return 'mr-1'
    if (spacing === 'medium') return 'mr-2'
    if (spacing === 'high') return 'mr-4'
  }

  return (
    <div
      ref={containerRef}
      className="overflow-hidden whitespace-nowrap relative"
    >
      <div
        ref={textRef}
        className={clsx(
          'inline-flex will-change-transform',
          isOverflowing && 'animate-marquee',
        )}
      >
        {!isOverflowing ? (
          <>{children}</>
        ) : (
          <>
            <div className={setSpacingClass()}>{children}</div>
            <div className={setSpacingClass()}>{children}</div>
          </>
        )}
      </div>
    </div>
  )
}
