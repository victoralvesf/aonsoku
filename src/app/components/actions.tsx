import clsx from 'clsx'
import { EllipsisVertical, Heart, Play, Shuffle } from 'lucide-react'
import { ButtonHTMLAttributes } from 'react'
import { Button as ComponentButton } from '@/app/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu'
import { SimpleTooltip } from '@/app/components/ui/simple-tooltip'
import { cn } from '@/lib/utils'

interface ActionsContainerProps {
  children: React.ReactNode
}

function Container({ children }: ActionsContainerProps) {
  return <div className="w-full my-6 flex items-center gap-1">{children}</div>
}

interface ActionsMainButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  tooltip: string
  buttonStyle?: 'primary' | 'secondary'
}

function Button({
  children,
  tooltip,
  buttonStyle = 'secondary',
  className,
  ...props
}: ActionsMainButtonProps) {
  return (
    <SimpleTooltip text={tooltip}>
      <ComponentButton
        className={cn(
          'rounded-full w-14 h-14 ease-linear duration-100 transition-all hover:shadow',
          buttonStyle === 'primary' && 'hover:scale-105',
          className,
        )}
        variant={buttonStyle === 'primary' ? 'default' : 'ghost'}
        {...props}
      >
        {children}
      </ComponentButton>
    </SimpleTooltip>
  )
}

interface DropdownProps {
  tooltip: string
  options?: React.ReactNode
}

function Dropdown({ tooltip, options }: DropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className="outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:ring-transparent focus:ring-transparent"
      >
        <ComponentButton
          className="rounded-full w-14 h-14 data-[state=open]:bg-accent"
          variant="ghost"
        >
          <SimpleTooltip text={tooltip}>
            <div className="min-w-14 h-14 rounded-full flex justify-center items-center">
              <EllipsisIcon />
            </div>
          </SimpleTooltip>
        </ComponentButton>
      </DropdownMenuTrigger>
      {options && (
        <DropdownMenuContent className="min-w-56" align="start">
          {options}
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  )
}

function PlayIcon() {
  return (
    <Play className="w-5 h-5 fill-slate-50 text-slate-50" strokeWidth={6} />
  )
}

function ShuffleIcon() {
  return <Shuffle className="w-5 h-5" strokeWidth={2} />
}

interface LikeIconProps {
  isStarred?: boolean
}

function LikeIcon({ isStarred }: LikeIconProps) {
  return (
    <Heart
      className={clsx('w-5 h-5', isStarred && 'text-red-500 fill-red-500')}
      strokeWidth={2}
    />
  )
}

function EllipsisIcon() {
  return <EllipsisVertical className="w-5 h-5" strokeWidth={2} />
}

export const Actions = {
  Container,
  Button,
  PlayIcon,
  ShuffleIcon,
  LikeIcon,
  EllipsisIcon,
  Dropdown,
}
