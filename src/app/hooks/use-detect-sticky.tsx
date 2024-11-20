import { useRef, useState, useEffect, RefObject } from 'react'

export function useDetectSticky(
  ref?: RefObject<HTMLDivElement>,
  observerSettings = { threshold: [1] },
) {
  const [isSticky, setIsSticky] = useState(false)
  const newRef = useRef<HTMLDivElement>(null)
  ref ||= newRef

  // mount
  useEffect(() => {
    if (!ref) return

    const cachedRef = ref.current

    const observer = new IntersectionObserver(
      ([e]) => setIsSticky(e.intersectionRatio < 1),
      observerSettings,
    )

    observer.observe(cachedRef!)

    // unmount
    return () => {
      observer.unobserve(cachedRef!)
    }
  }, [observerSettings, ref])

  return {
    isSticky,
    ref,
    setIsSticky,
  }
}
