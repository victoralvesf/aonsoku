import { english } from "./en"
import { brazilianPortuguese } from "./pt-BR"

export const currentLanguages = [
  { nativeName: 'English (US)', langCode: 'en-US', flag: 'US' },
  { nativeName: 'Português (Brasil)', langCode: 'pt-BR', flag: 'BR' },
]

export const languages = {
  'en-US': english,
  'pt-BR': brazilianPortuguese
}