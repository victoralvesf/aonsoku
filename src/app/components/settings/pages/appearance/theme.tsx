import clsx from 'clsx'
import { Check, Minus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { ContentItemTitle } from '@/app/components/settings/section'
import { appThemes } from '@/app/observers/theme-observer'
import { useTheme } from '@/store/theme.store'
import { Theme } from '@/types/themeContext'

export function ThemeSettingsPicker() {
  const { t } = useTranslation()
  const { theme: currentTheme, setTheme } = useTheme()

  return (
    <div className="h-full space-y-4">
      <ContentItemTitle>{t('theme.label')}</ContentItemTitle>
      <div className="w-full h-full grid grid-cols-4 gap-3">
        {appThemes.map((theme) => {
          const isActive = theme === currentTheme

          return (
            <div key={theme} onClick={() => setTheme(theme)}>
              <ThemePlaceholder theme={theme} />
              <ThemeTitle theme={theme} isActive={isActive} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function ThemePlaceholder({ theme }: { theme: Theme }) {
  return (
    <div className={theme}>
      <div className="bg-background aspect-square border border-border rounded overflow-hidden flex cursor-pointer">
        <div className="w-1/3 h-full bg-background border-r border-border flex flex-col p-1 gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="w-full h-1/5 bg-accent rounded-[2px]" />
          ))}
        </div>
        <div className="w-full h-full bg-background-foreground flex flex-col gap-1 p-1 *:w-full *:h-1/4 *:rounded-[2px]">
          <div className="bg-accent" />
          <div className="bg-primary" />
          <div className="bg-muted" />
          <div className="bg-secondary" />
        </div>
      </div>
    </div>
  )
}

type ThemeTitleProps = {
  isActive: boolean
  theme: Theme
}

export function ThemeTitle({ isActive, theme }: ThemeTitleProps) {
  const { t } = useTranslation()

  return (
    <span
      className={clsx(
        'mt-2 flex items-center gap-1',
        !isActive && 'text-muted-foreground/70',
      )}
    >
      <Check
        size={16}
        strokeWidth={2}
        className={clsx(!isActive && 'hidden')}
        aria-hidden="true"
      />
      <Minus
        size={16}
        strokeWidth={2}
        className={clsx(isActive && 'hidden')}
        aria-hidden="true"
      />
      <span className="text-xs font-medium">{t(`theme.${theme}`)}</span>
    </span>
  )
}
