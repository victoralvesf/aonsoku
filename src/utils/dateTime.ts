import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import relativeTime from 'dayjs/plugin/relativeTime'
import timezone from 'dayjs/plugin/timezone'
import updateLocale from 'dayjs/plugin/updateLocale'
import utc from 'dayjs/plugin/utc'

import 'dayjs/locale/pt'
import 'dayjs/locale/pt-br'
import 'dayjs/locale/es'
import 'dayjs/locale/zh-cn'
import 'dayjs/locale/de'
import 'dayjs/locale/ru'
import 'dayjs/locale/fr'
import 'dayjs/locale/sv'
import 'dayjs/locale/cs'

import i18n from '@/i18n'
import { languages, resources } from '@/i18n/languages'

function getDayJsLocale(langCode: string) {
  const lang = languages.find((lang) => lang.langCode === langCode)
  return lang?.dayjsLocale ?? 'en-US'
}

dayjs.extend(duration)
dayjs.extend(relativeTime)
dayjs.extend(updateLocale)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(localizedFormat)

languages.forEach((lang) => {
  const langCode = lang.langCode as keyof typeof resources
  const langTranslationKeys = resources[langCode].translation

  if ('dayjs' in langTranslationKeys) {
    dayjs.updateLocale(lang.dayjsLocale, langTranslationKeys.dayjs)
  }
})

const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
dayjs.tz.setDefault(browserTimezone)

const savedLang = localStorage.getItem('i18nextLng') || 'en-US'
dayjs.locale(getDayJsLocale(savedLang))

i18n.on('languageChanged', (lang: string) => {
  dayjs.locale(getDayJsLocale(lang))
})

const dateTime = dayjs
export default dateTime
