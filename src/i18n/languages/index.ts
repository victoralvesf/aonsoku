import { english } from "./en"
import { brazilianPortuguese } from "./pt-BR"

export const languages = {
  'en-US': english,
  'pt-BR': brazilianPortuguese
}

export const currentLanguages = [
  {
    nativeName: 'English (US)',
    langCode: 'en-US',
    flag: 'US',
    dayjsLocale: 'en',
  },
  {
    nativeName: 'Português (Brasil)',
    langCode: 'pt-BR',
    flag: 'BR',
    dayjsLocale: 'pt-br',
  },
]
