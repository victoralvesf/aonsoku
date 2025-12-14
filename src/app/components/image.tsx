import omit from 'lodash/omit'
import { ImgHTMLAttributes } from 'react'
import {
  Effect,
  LazyLoadImage,
  ScrollPosition,
  trackWindowScroll,
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
