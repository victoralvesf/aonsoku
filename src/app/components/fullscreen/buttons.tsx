import clsx from 'clsx'
import { ChevronDown } from 'lucide-react'
import { Badge } from '@/app/components/ui/badge'

const buttonStyle = clsx([
  'w-10',
  'h-10',
  'p-0',
  'border-none',
  'filter-none',
  'rounded-full',
  'bg-black/0',
  'hover:bg-background/40',
  'flex',
  'items-center',
  'justify-center',
  'group',
  'transition-colors',
])

export function CloseFullscreenButton() {
  return (
    <Badge variant="outline" className={buttonStyle}>
      <ChevronDown className="w-7 h-7 text-foreground" />
    </Badge>
  )
}
