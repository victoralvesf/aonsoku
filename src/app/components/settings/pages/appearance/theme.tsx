import clsx from 'clsx'
import { Check, Minus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { ContentItemTitle } from '@/app/components/settings/section'
import { appThemes } from '@/app/observers/theme-observer'
import { useTheme } from '@/store/theme.store'

export function ThemeSettingsPicker() {
  const { t } = useTranslation()
  const { theme: currentTheme, setTheme } = useTheme()

  return (
    <div className="h-full space-y-4">
      <ContentItemTitle>{t('theme.label')}</ContentItemTitle>
      <div className="w-full h-full grid grid-cols-4 gap-3">
        {appThemes.map((theme) => {
          const themeIsActive = theme === currentTheme

          return (
            <div key={theme} onClick={() => setTheme(theme)}>
              <div className={theme}>
                <ThemePlaceholder />
              </div>
              <span
                className={clsx(
                  'mt-2 flex items-center gap-1',
                  !themeIsActive && 'text-muted-foreground/70',
                )}
              >
                <Check
                  size={16}
                  strokeWidth={2}
                  className={clsx(!themeIsActive && 'hidden')}
                  aria-hidden="true"
                />
                <Minus
                  size={16}
                  strokeWidth={2}
                  className={clsx(themeIsActive && 'hidden')}
                  aria-hidden="true"
                />
                <span className="text-xs font-medium">
                  {t(`theme.${theme}`)}
                </span>
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ThemePlaceholder() {
  return (
    <div className="bg-background aspect-square border border-border rounded overflow-hidden flex cursor-pointer">
      <div className="w-1/3 h-full bg-background border-r border-border flex flex-col p-1 gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="w-full h-2 bg-accent rounded-[2px]" />
        ))}
      </div>
      <div className="w-full h-full bg-background-foreground flex flex-col gap-1 p-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="w-full h-1/4 bg-accent rounded-[2px]" />
        ))}
      </div>
    </div>
  )
}
