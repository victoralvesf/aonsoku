import { ChevronDown, Moon, Sun } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { useTheme } from "@/app/contexts/theme-context";

export function CloseFullscreenButton() {
  return (
    <Button
      variant="outline"
      className="w-10 h-10 p-2 rounded-full bg-slate-100/20 dark:bg-slate-800/20 border-slate-100/20 hover:bg-slate-100/40 dark:hover:bg-slate-800/40 shadow-lg"
    >
      <ChevronDown className="w-8 h-8 text-slate-800/80 hover:text-slate-800 dark:text-slate-100/80 dark:hover:text-slate-100" strokeWidth={3} />
    </Button>
  )
}

export function SwitchThemeButton() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="outline"
      className="w-10 h-10 p-2 rounded-full bg-slate-100/20 dark:bg-slate-800/20 border-slate-100/20 hover:bg-slate-100/40 dark:hover:bg-slate-800/40 shadow-lg"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? (
        <Sun className="w-8 h-8 text-slate-800/80 hover:text-slate-800 dark:text-slate-100/80 dark:hover:text-slate-100" />
      ) : (
        <Moon className="w-8 h-8 text-slate-800/80 hover:text-slate-800 dark:text-slate-100/80 dark:hover:text-slate-100" />
      )}
    </Button>
  )
}