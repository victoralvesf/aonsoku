import { Moon, Sun } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/app/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu'
import { appThemes } from '@/app/observers/theme-observer'
import { cn } from '@/lib/utils'
import { useTheme } from '@/store/theme.store'

interface ThemeToggleProps extends React.HTMLAttributes<HTMLDivElement> {}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme: currentTheme, setTheme } = useTheme()
  const { t } = useTranslation()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="py-1">
        <Button
          variant="outline"
          size="icon"
          className={cn(className, 'outline-none drop-shadow-none w-8 h-8 p-0')}
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {appThemes.map((theme) => (
          <DropdownMenuCheckboxItem
            key={theme}
            onClick={() => setTheme(theme)}
            checked={currentTheme === theme}
            disabled={currentTheme === theme}
          >
            {t(`theme.${theme}`)}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
