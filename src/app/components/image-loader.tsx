import { ReactNode, useEffect, useRef, useState } from 'react'
import { getCoverArtUrl } from '@/api/httpClient'
import { CoverArt } from '@/types/coverArtType'

interface ImageLoaderProps {
  id?: string
  type: CoverArt
  size?: string | number
  children: (src: string | undefined, isLoading: boolean) => ReactNode
}

export function ImageLoader({
  id,
  type,
  size = 300,
  children,
}: ImageLoaderProps) {
  const [src, setSrc] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    setIsLoading(true)
    setSrc('')

    if (!id) {
      setIsLoading(false)
      return
    }

    const abortController = new AbortController()
    abortControllerRef.current = abortController

    const fetchImage = async () => {
      try {
        const url = await getCoverArtUrl(id, type, size.toString())

        if (!abortController.signal.aborted) {
          setSrc(url)
          setIsLoading(false)
        }
      } catch (error) {
        if (!abortController.signal.aborted) {
          console.error('Error fetching image:', error)
          setIsLoading(false)
        }
      }
    }

    fetchImage()

    return () => {
      abortController.abort()
    }
  }, [id, type, size])

  return <>{children(src, isLoading)}</>
}
