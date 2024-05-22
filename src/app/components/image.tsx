import React from "react"
import { LazyLoadImage, trackWindowScroll, ScrollPosition } from 'react-lazy-load-image-component'

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  scrollPosition: ScrollPosition
}

const Image = (({ scrollPosition, ...props }: ImageProps) => {
  return (
    <div className="flex items-center">
      <LazyLoadImage
        effect="black-and-white"
        {...props}
        scrollPosition={scrollPosition}
      />
    </div>
  )
})

export default trackWindowScroll(Image)