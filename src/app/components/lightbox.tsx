import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'

interface CustomLightBoxProps {
  open: boolean
  close: (value: boolean) => void
  src: string
  alt: string
  size: number
}

export function CustomLightBox({
  open,
  close,
  src,
  alt,
  size,
}: CustomLightBoxProps) {
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
        fade: 500,
      }}
      render={{
        buttonNext: () => null,
        buttonPrev: () => null,
      }}
    />
  )
}
