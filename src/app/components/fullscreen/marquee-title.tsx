import { clsx } from 'clsx'
import {
  CSSProperties,
  ReactNode,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'

interface MarqueeTitleProps {
  children: ReactNode
}

const SPEED = 10

export function MarqueeTitle({ children }: MarqueeTitleProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const [isOverflowing, setIsOverflowing] = useState(false)
  const [animationSize, setAnimationSize] = useState(0)
  const [animationTime, setAnimationTime] = useState(0)

  function calculateMarqueeTime(width: number) {
    if (width < 100) {
      return width / (SPEED / 2)
    } else if (width > 100 && width < 500) {
      return width / SPEED
    } else if (width > 500 && width < 1000) {
      return width / (SPEED * 2)
    } else {
      return width / SPEED
    }
  }

  const calculateOverflow = useCallback(() => {
    if (!containerRef.current || !textRef.current) return

    const containerWidth = containerRef.current.offsetWidth
    const textWidth = textRef.current.offsetWidth
    const overflowWidth = textWidth - containerWidth

    if (textWidth > containerWidth) {
      setIsOverflowing(true)
      setAnimationSize(overflowWidth)
      const time = calculateMarqueeTime(overflowWidth)

      setAnimationTime(time)
    } else {
      setIsOverflowing(false)
      setAnimationSize(0)
      setAnimationTime(0)
    }
  }, [containerRef, textRef])

  useLayoutEffect(() => {
    calculateOverflow()

    const handleResize = () => {
      requestAnimationFrame(calculateOverflow)
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [calculateOverflow, children])

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
        style={
          {
            '--tw-translate-x-end': `-${animationSize}px`,
            '--tw-marquee-time': `${animationTime}s`,
          } as CSSProperties
        }
      >
        {children}
      </div>
    </div>
  )
}
