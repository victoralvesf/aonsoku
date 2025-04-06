import cs from './locales/cs.json'
import de from './locales/de.json'
import en from './locales/en.json'
import es from './locales/es.json'
import fr from './locales/fr.json'
import ptBr from './locales/pt-BR.json'
import pt from './locales/pt.json'
import ru from './locales/ru.json'
import sv from './locales/sv.json'
import zhHans from './locales/zh-Hans.json'

export const resources = {
  cs: { translation: cs },
  de: { translation: de },
  'en-US': { translation: en },
  'es-ES': { translation: es },
  fr: { translation: fr },
  pt: { translation: pt },
  'pt-BR': { translation: ptBr },
  ru: { translation: ru },
  sv: { translation: sv },
  'zh-Hans': { translation: zhHans },
}

export const languages = [
  {
    nativeName: 'Čeština',
    langCode: 'cs',
    flag: 'CZ',
    dayjsLocale: 'cs',
  },
  {
    nativeName: 'Deutsch',
    langCode: 'de',
    flag: 'DE',
    dayjsLocale: 'de',
  },
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
    nativeName: 'Français',
    langCode: 'fr',
    flag: 'FR',
    dayjsLocale: 'fr',
  },
  {
    nativeName: 'Português (Portugal)',
    langCode: 'pt',
    flag: 'PT',
    dayjsLocale: 'pt',
  },
  {
    nativeName: 'Português (Brasil)',
    langCode: 'pt-BR',
    flag: 'BR',
    dayjsLocale: 'pt-br',
  },
  {
    nativeName: 'Русский',
    langCode: 'ru',
    flag: 'RU',
    dayjsLocale: 'ru',
  },
  {
    nativeName: 'Svenska',
    langCode: 'sv',
    flag: 'SE',
    dayjsLocale: 'sv',
  },
  {
    nativeName: '简体中文',
    langCode: 'zh-Hans',
    flag: 'CN',
    dayjsLocale: 'zh-cn',
  },
]
