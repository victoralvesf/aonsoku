import omit from 'lodash/omit'
import { ImgHTMLAttributes } from 'react'
import {
  LazyLoadImage,
  trackWindowScroll,
  ScrollPosition,
  Effect,
} from 'react-lazy-load-image-component'

interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  scrollPosition: ScrollPosition
  effect?: Effect
}

const Image = ({
  scrollPosition,
  effect = 'opacity',
  ...props
}: ImageProps) => {
  const sanitizedProps = omit(props, 'forwardRef')

  return (
    <div className="flex items-center">
      <LazyLoadImage
        effect={effect}
        scrollPosition={scrollPosition}
        {...sanitizedProps}
      />
    </div>
  )
}

export default trackWindowScroll(Image)
