import en from './locales/en.json'
import ptBr from './locales/pt-BR.json'

export const resources = {
  'en-US': { translation: en },
  'pt-BR': { translation: ptBr },
}

export const languages = [
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
