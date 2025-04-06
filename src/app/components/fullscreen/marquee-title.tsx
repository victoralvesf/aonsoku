import { clsx } from 'clsx'
import {
  ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import Marquee from 'react-fast-marquee'

interface MarqueeTitleProps {
  children: ReactNode
  gap: string
}

export function MarqueeTitle({ children, gap }: MarqueeTitleProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const [isOverflowing, setIsOverflowing] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [marqueeKey, setMarqueeKey] = useState('')
  const [containerKey, setContainerKey] = useState('')

  const calculateOverflow = useCallback(() => {
    if (!containerRef.current || !textRef.current) return

    const containerWidth = containerRef.current.offsetWidth
    const textWidth = textRef.current.offsetWidth

    const isOversizing = textWidth > containerWidth

    if (isOverflowing && !isOversizing) {
      setMarqueeKey(Math.random().toString())
    }

    setIsOverflowing(isOversizing)
  }, [containerRef, textRef, isOverflowing])

  useLayoutEffect(() => {
    const handleResize = () => {
      requestAnimationFrame(calculateOverflow)
    }

    calculateOverflow()
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [calculateOverflow])

  useEffect(() => {
    setIsOverflowing(false)
    setIsFinished(false)
    setMarqueeKey(Math.random().toString())
    setContainerKey(Math.random().toString())

    calculateOverflow()
  }, [calculateOverflow, children])

  return (
    <div className="relative">
      {/* Not shown in screen, its just for calculations */}
      <div
        key={containerKey}
        className="w-full overflow-hidden whitespace-nowrap opacity-0 absolute left-0 right-0 bottom-0 pointer-events-none"
        ref={containerRef}
      >
        <div className="inline-flex" ref={textRef}>
          {children}
        </div>
      </div>

      <div>
        <Marquee
          key={marqueeKey}
          className={clsx(
            isOverflowing && !isFinished && 'maskImage-marquee-fade',
            isFinished && 'maskImage-marquee-fade-finished',
          )}
          speed={30}
          play={isOverflowing}
          loop={2}
          delay={3}
          pauseOnHover={true}
          onFinish={() => {
            setIsFinished(true)
          }}
        >
          <div className={gap}>{children}</div>
        </Marquee>
      </div>
    </div>
  )
}
