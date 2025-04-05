import { useLayoutEffect, useState } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'

interface CustomLightBoxProps {
  open: boolean
  close: (value: boolean) => void
  src: string
  alt: string
}

export function CustomLightBox({ open, close, src, alt }: CustomLightBoxProps) {
  const [size, setSize] = useState(600)

  useLayoutEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth

      if (width >= 1536) {
        setSize(600) // 2xl breakpoint
      } else {
        setSize(400) // default size
      }
    }

    let animationFrameId: number

    const resizeHandler = () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
      animationFrameId = requestAnimationFrame(handleResize)
    }

    handleResize()
    window.addEventListener('resize', resizeHandler)

    return () => {
      window.removeEventListener('resize', resizeHandler)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <Lightbox
      open={open}
      close={() => close(false)}
      slides={[
        {
          src,
          width: size,
          height: size,
          alt,
          imageFit: 'contain',
        },
      ]}
      carousel={{
        finite: true,
        preload: 0,
      }}
      controller={{
        closeOnBackdropClick: true,
      }}
      animation={{
        fade: 300,
      }}
      render={{
        buttonNext: () => null,
        buttonPrev: () => null,
      }}
    />
  )
}
