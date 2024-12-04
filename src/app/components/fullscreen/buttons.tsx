import clsx from 'clsx'
import { ChevronDown, Moon, Sun } from 'lucide-react'
import { Badge } from '@/app/components/ui/badge'
import { Button } from '@/app/components/ui/button'
import { useTheme } from '@/store/theme.store'

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

export function SwitchThemeButton() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="outline"
      className={buttonStyle}
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      {theme === 'dark' ? (
        <Moon className="w-5 h-5 text-foreground" />
      ) : (
        <Sun className="w-5 h-5 text-foreground" />
      )}
    </Button>
  )
}
