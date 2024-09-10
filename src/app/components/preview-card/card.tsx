import { Play } from 'lucide-react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { Link } from 'react-router-dom'
import { Button } from '@/app/components/ui/button'
import { cn } from '@/lib/utils'

interface Children {
  children: React.ReactNode
}

interface RootProps extends Children {}

function Root({ children }: RootProps) {
  return <div className="cursor-pointer">{children}</div>
}

interface ImageWrapperProps extends Children {
  link: string
}

function ImageWrapper({ children, link }: ImageWrapperProps) {
  return (
    <div className="group flex-1 aspect-square rounded bg-border relative overflow-hidden">
      <Link to={link} data-testid="card-image-link">
        {children}
      </Link>
    </div>
  )
}

interface ImageProps {
  src: string
  alt: string
}

function Image({ src, alt }: ImageProps) {
  return (
    <LazyLoadImage
      src={src}
      alt={alt}
      effect="opacity"
      width="100%"
      height="100%"
      className="aspect-square object-cover w-full h-full absolute inset-0 z-0"
      data-testid="card-image"
    />
  )
}

interface PlayButtonProps {
  onClick: () => void
}

function PlayButton({ onClick }: PlayButtonProps) {
  return (
    <div className="w-full h-full flex items-center justify-center rounded bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 absolute inset-0 z-10">
      <Button
        className="opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-full w-12 h-12 z-20"
        variant="outline"
        onClick={(e) => {
          e.stopPropagation()
          e.preventDefault()
          onClick()
        }}
        data-testid="card-play-button"
      >
        <Play className="fill-foreground" />
      </Button>
    </div>
  )
}

interface InfoWrapperProps extends Children {}

function InfoWrapper({ children }: InfoWrapperProps) {
  return <div className="flex flex-col cursor-default">{children}</div>
}

interface TitleProps {
  link: string
  children: string
}

function Title({ link, children }: TitleProps) {
  return (
    <Link to={link} className="w-fit" data-testid="card-title-link">
      <p
        className="leading-7 text-sm font-semibold line-clamp-1 hover:underline"
        data-testid="card-title"
      >
        {children}
      </p>
    </Link>
  )
}

interface SubtitleProps {
  link: string
  children: string
  enableLink?: boolean
  className?: string
}

function Subtitle({
  link,
  children,
  enableLink = true,
  className,
}: SubtitleProps) {
  if (!enableLink) {
    return (
      <p
        className={cn(
          'leading-5 line-clamp-1 text-xs text-muted-foreground -mt-1',
          className,
        )}
        data-testid="card-subtitle"
      >
        {children}
      </p>
    )
  }

  return (
    <Link to={link} data-testid="card-subtitle-link" className="w-fit">
      <p
        className={cn(
          'line-clamp-1 text-xs text-muted-foreground -mt-1 hover:underline',
          className,
        )}
        data-testid="card-subtitle"
      >
        {children}
      </p>
    </Link>
  )
}

export const PreviewCard = {
  Root,
  ImageWrapper,
  Image,
  PlayButton,
  InfoWrapper,
  Title,
  Subtitle,
}