import { ChevronDown, Moon, Sun } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { useTheme } from '@/app/contexts/theme-context'
import { Badge } from '@/app/components/ui/badge'

const buttonStyle = [
  'w-10',
  'h-10',
  'p-2',
  'shadow-lg',
  'rounded-full',
  'border-slate-100/20',
  'bg-slate-100/20',
  'hover:bg-slate-100/40',
  'dark:bg-slate-500/20',
  'dark:hover:bg-slate-500/40',
].join(' ')

export function CloseFullscreenButton() {
  return (
    <Badge variant="outline" className={buttonStyle}>
      <ChevronDown
        className="w-8 h-8 text-slate-800/80 hover:text-slate-800 dark:text-slate-100/80 dark:hover:text-slate-100"
        strokeWidth={3}
      />
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
        <Moon className="w-8 h-8 text-slate-800/80 hover:text-slate-800 dark:text-slate-100/80 dark:hover:text-slate-100" />
      ) : (
        <Sun className="w-8 h-8 text-slate-800/80 hover:text-slate-800 dark:text-slate-100/80 dark:hover:text-slate-100" />
      )}
    </Button>
  )
}
