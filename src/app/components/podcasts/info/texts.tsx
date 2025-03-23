import { ComponentProps, ComponentPropsWithoutRef, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

type DivProps = ComponentPropsWithoutRef<'div'>

export function Root({ className, children, ...rest }: DivProps) {
  return (
    <div
      {...rest}
      className={cn('flex w-full flex-col justify-end space-y-2', className)}
    >
      {children}
    </div>
  )
}

interface TextProp {
  children: ReactNode
}

export function Title({ children }: TextProp) {
  return (
    <h1 className="tracking-tight font-bold text-3xl 2xl:text-4xl !leading-snug -mb-1 antialiased line-clamp-2">
      {children}
    </h1>
  )
}

export function Subtitle({ children }: TextProp) {
  return (
    <h3 className="text-lg font-medium text-muted-foreground">{children}</h3>
  )
}

type SubtitleLinkProps = ComponentProps<typeof Link>

export function SubtitleLink({
  children,
  className,
  ...rest
}: SubtitleLinkProps) {
  return (
    <Link
      {...rest}
      className={cn(
        'text-lg font-medium text-muted-foreground hover:underline',
        className,
      )}
    >
      {children}
    </Link>
  )
}

export function Description({ children }: TextProp) {
  return (
    <h3 className="text-sm text-muted-foreground line-clamp-2">{children}</h3>
  )
}

function DetailsRoot({ className, children, ...rest }: DivProps) {
  return (
    <div
      {...rest}
      className={cn('flex gap-1 text-muted-foreground text-sm', className)}
    >
      {children}
    </div>
  )
}

function Text({ children }: TextProp) {
  return <span>{children}</span>
}

type LinkProps = ComponentPropsWithoutRef<'a'>

function DetailLink({ className, children, ...rest }: LinkProps) {
  return (
    <a {...rest} target="_blank" rel="noreferrer">
      <span
        className={cn('flex gap-1 items-center hover:text-primary', className)}
      >
        {children}
      </span>
    </a>
  )
}

export const Details = {
  Root: DetailsRoot,
  Text,
  Link: DetailLink,
}
