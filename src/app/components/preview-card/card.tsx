import { Play } from 'lucide-react'
import { ComponentPropsWithoutRef } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { Link } from 'react-router-dom'
import { Button } from '@/app/components/ui/button'
import { cn } from '@/lib/utils'

interface Children {
  children: React.ReactNode
}

type RootProps = ComponentPropsWithoutRef<'div'>

function Root({ className, children, ...props }: RootProps) {
  return (
    <div className={cn('cursor-pointer', className)} {...props}>
      {children}
    </div>
  )
}

interface ImageWrapperProps extends Children {
  link: string
}

function ImageWrapper({ children, link }: ImageWrapperProps) {
  return (
    <div className="group flex-1 aspect-square rounded bg-border relative overflow-hidden">
      <Link
        to={link}
        data-testid="card-image-link"
        className="flex h-full w-full"
      >
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
    <div className="w-full truncate" data-testid="card-title">
      <Link
        to={link}
        className="max-w-full truncate hover:underline leading-7 text-sm font-semibold"
        data-testid="card-title-link"
      >
        {children}
      </Link>
    </div>
  )
}

interface SubtitleProps {
  link?: string
  children: React.ReactNode
  enableLink?: boolean
  className?: string
}

function Subtitle({
  link,
  children,
  enableLink = true,
  className,
}: SubtitleProps) {
  if (!enableLink || !link) {
    return (
      <div className="w-full">
        <p
          className={cn(
            'leading-5 truncate text-xs text-muted-foreground -mt-1',
            className,
          )}
          data-testid="card-subtitle"
        >
          {children}
        </p>
      </div>
    )
  }

  return (
    <div className="flex w-full truncate -mt-1" data-testid="card-subtitle">
      <Link
        to={link}
        data-testid="card-subtitle-link"
        className={cn(
          'max-w-full truncate text-xs text-muted-foreground hover:underline',
          className,
        )}
      >
        {children}
      </Link>
    </div>
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
