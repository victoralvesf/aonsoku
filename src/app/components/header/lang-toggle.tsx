import { ReactCountryFlag } from 'react-country-flag'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select'
import { languages } from '@/i18n/languages'
import { useLang } from '@/store/lang.store'

export function LangToggle() {
  const { langCode, setLang, flag } = useLang()

  return (
    <Select value={langCode} onValueChange={(lang) => setLang(lang)}>
      <SelectTrigger className="w-[70px] h-8 ring-offset-transparent focus:ring-0">
        <SelectValue>
          <ReactCountryFlag countryCode={flag} svg />
        </SelectValue>
      </SelectTrigger>
      <SelectContent align="end">
        <SelectGroup>
          {languages.map((language) => (
            <SelectItem
              key={language.langCode}
              value={language.langCode}
              disabled={language.langCode === langCode}
            >
              <ReactCountryFlag countryCode={language.flag} svg />
              <span className="ml-1">{language.nativeName}</span>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
