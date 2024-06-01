import { Moon, Sun } from "lucide-react"

import { Button } from "@/app/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { useTheme } from "@/app/contexts/theme-context"
import { useTranslation } from "react-i18next"

interface ThemeToggleProps extends React.HTMLAttributes<HTMLDivElement> { }

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme()
  const { t } = useTranslation()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="py-1">
        <Button
          variant="ghost"
          size="icon"
          className={cn(className, "outline-none drop-shadow-none w-8 h-8")}
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuCheckboxItem
          onClick={() => setTheme("light")}
          checked={theme === 'light'}
        >
          {t('theme.light')}
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          onClick={() => setTheme("dark")}
          checked={theme === 'dark'}
        >
          {t('theme.dark')}
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          onClick={() => setTheme("system")}
          checked={theme === 'system'}
        >
          {t('theme.system')}
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
