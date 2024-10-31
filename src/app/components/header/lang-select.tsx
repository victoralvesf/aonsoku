import { LanguagesIcon } from 'lucide-react'
import { ReactCountryFlag } from 'react-country-flag'
import { useTranslation } from 'react-i18next'
import {
  DropdownMenuCheckboxItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/app/components/ui/dropdown-menu'
import { languages } from '@/i18n/languages'
import { useLang } from '@/store/lang.store'

export function LangSelect() {
  const { t } = useTranslation()
  const { langCode, setLang } = useLang()

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <LanguagesIcon className="mr-2 h-4 w-4" />
        <span>{t('menu.language')}</span>
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent>
          {languages.map((language) => (
            <DropdownMenuCheckboxItem
              key={language.langCode}
              checked={language.langCode === langCode}
              disabled={language.langCode === langCode}
              onSelect={(e) => {
                e.preventDefault()
                setLang(language.langCode)
              }}
            >
              <ReactCountryFlag countryCode={language.flag} svg />
              <span className="ml-1">{language.nativeName}</span>
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  )
}
