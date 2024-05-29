import React from "react"
import { LazyLoadImage, trackWindowScroll, ScrollPosition, Effect } from 'react-lazy-load-image-component'

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  scrollPosition: ScrollPosition
  effect?: Effect
}

const Image = (({ scrollPosition, effect = "black-and-white", ...props }: ImageProps) => {
  return (
    <div className="flex items-center">
      <LazyLoadImage
        effect={effect}
        {...props}
        scrollPosition={scrollPosition}
      />
    </div>
  )
})

export default trackWindowScroll(Image)