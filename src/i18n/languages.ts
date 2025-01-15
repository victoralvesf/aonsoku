import de from './locales/de.json'
import en from './locales/en.json'
import es from './locales/es.json'
import ptBr from './locales/pt-BR.json'
import ru from './locales/ru.json'
import zhHans from './locales/zh-Hans.json'

export const resources = {
  'en-US': { translation: en },
  'es-ES': { translation: es },
  'pt-BR': { translation: ptBr },
  'zh-Hans': { translation: zhHans },
  de: { translation: de },
  ru: { translation: ru },
}

export const languages = [
  {
    nativeName: 'English (US)',
    langCode: 'en-US',
    flag: 'US',
    dayjsLocale: 'en',
  },
  {
    nativeName: 'Español (España)',
    langCode: 'es-ES',
    flag: 'ES',
    dayjsLocale: 'es',
  },
  {
    nativeName: 'Português (Brasil)',
    langCode: 'pt-BR',
    flag: 'BR',
    dayjsLocale: 'pt-br',
  },
  {
    nativeName: '简体中文',
    langCode: 'zh-Hans',
    flag: 'CN',
    dayjsLocale: 'zh-cn',
  },
  {
    nativeName: 'Deutsch',
    langCode: 'de',
    flag: 'DE',
    dayjsLocale: 'de',
  },
  {
    nativeName: 'Русский',
    langCode: 'ru',
    flag: 'RU',
    dayjsLocale: 'ru',
  },
]
