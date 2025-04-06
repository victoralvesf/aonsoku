import { useTranslation } from 'react-i18next'
import {
  ThemePlaceholder,
  ThemeTitle,
} from '@/app/components/settings/pages/appearance/theme'
import { CommandGroup, CommandItem } from '@/app/components/ui/command'
import { appThemes } from '@/app/observers/theme-observer'
import { useTheme } from '@/store/theme.store'
import { CommandItemProps } from './command-menu'

export function CommandThemes({ runCommand }: CommandItemProps) {
  const { t } = useTranslation()
  const { theme: currentTheme, setTheme } = useTheme()

  return (
    <CommandGroup heading={t('theme.label')}>
      <div className="grid grid-cols-4">
        {appThemes.map((theme) => (
          <CommandItem
            key={theme}
            onSelect={() => runCommand(() => setTheme(theme))}
            disabled={theme === currentTheme}
          >
            <div className="w-full h-full">
              <ThemePlaceholder theme={theme} />
              <ThemeTitle theme={theme} isActive={theme === currentTheme} />
            </div>
          </CommandItem>
        ))}
      </div>
    </CommandGroup>
  )
}
